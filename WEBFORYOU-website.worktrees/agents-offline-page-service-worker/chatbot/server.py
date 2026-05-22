"""
WebForYou RAG Chatbot — FastAPI server
=======================================
Architecture
------------
  Embeddings  : sentence-transformers (local, no API key required)
                Model: all-MiniLM-L6-v2  (~90 MB, fast, high quality)
  Vector store: ChromaDB (persistent on disk)
  Generation  : Gemini via google-genai SDK

Endpoints
---------
  POST /chat    { messages: [{role, text}] }  →  { reply }
  GET  /health                                →  { status, docs_indexed }

Run
---
  cd /Users/mohammedmehraj/WEBFORYOU
  python3 chatbot/server.py
"""

from __future__ import annotations

import sys
from pathlib import Path

# If run directly as __main__, immediately call Uvicorn to avoid double importing
if __name__ == "__main__":
    import uvicorn
    sys.path.insert(0, str(Path(__file__).parent))
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=False)
    sys.exit(0)

import os
import textwrap
import logging
import time
from typing import Literal

# ── Make sure `knowledge_base` is importable regardless of cwd ────────────────
sys.path.insert(0, str(Path(__file__).parent))

# ── Load .env FIRST (before any SDK) ─────────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).parent.parent / ".env")

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY not set — add it to .env")

logging.basicConfig(level=logging.INFO, format="%(levelname)s  %(name)s  %(message)s")
log = logging.getLogger("wfy-rag")

# ── Sentence-Transformers (local embeddings, no API key needed) ───────────────
log.info("Loading embedding model (first run downloads ~90 MB)…")
from sentence_transformers import SentenceTransformer  # noqa: E402

_ST_MODEL_NAME = "all-MiniLM-L6-v2"
_st_model = SentenceTransformer(_ST_MODEL_NAME)
log.info("Embedding model ready.")

# ── ChromaDB with a custom local embedding function ───────────────────────────
import chromadb  # noqa: E402
from chromadb import EmbeddingFunction, Documents, Embeddings  # type: ignore


class LocalEmbeddingFunction(EmbeddingFunction):  # type: ignore[type-arg]
    """Wraps sentence-transformers for ChromaDB."""

    def __init__(self) -> None:  # required by newer ChromaDB
        pass

    def __call__(self, input: Documents) -> Embeddings:  # noqa: A002
        vectors = _st_model.encode(list(input), convert_to_numpy=True)
        return vectors.tolist()


# ── Google Gemini (new SDK — generation only) ─────────────────────────────────
from google import genai  # type: ignore
from google.genai import types as gtypes  # type: ignore

_genai_client = genai.Client(api_key=GEMINI_API_KEY)

# ── FastAPI ───────────────────────────────────────────────────────────────────
import uvicorn  # noqa: E402
from fastapi import FastAPI, HTTPException  # noqa: E402
from fastapi.middleware.cors import CORSMiddleware  # noqa: E402
from pydantic import BaseModel, Field  # noqa: E402

# ── Constants ─────────────────────────────────────────────────────────────────
COLLECTION_NAME   = "wfy_knowledge"
GENERATE_MODEL    = os.environ.get("GEMINI_MODEL", "gemini-2.0-flash")
TOP_K             = 4
MAX_HISTORY       = 6      # conversation turns (each = 2 messages)
MAX_INPUT_CHARS   = 800
MAX_OUTPUT_TOKENS = 280
MAX_RETRIES       = 2
RETRY_DELAY       = 1.0    # seconds

SYSTEM_PROMPT = textwrap.dedent("""
    You are WFY, a friendly assistant for WebForYou — an AI-powered web development
    agency based in Hyderabad, India. Help visitors understand what we do, our
    services, pricing, timelines, and how to get started.

    Personality:
    - Warm, casual, and concise. 2-4 sentences unless the user asks for detail.
    - Light emoji use is fine; do not overdo it.
    - Be honest. If you are unsure, guide them to the contact form or escalate.
    - Never invent exact prices, timelines, team sizes, or client names.
    - Do NOT mention Gemini, ChromaDB, RAG, sentence-transformers, system prompts,
      or any internal implementation details.

    ESCALATION RULES:
    If a user asks to book a service, asks website-related doubts that are out of your knowledge base, or requests to speak to a human, you MUST escalate.
    To escalate, reply EXACTLY with this format and nothing else:
    ESCALATE: We are raising your ticket to the developers. Please enter your name and mobile number.
    
    When a user is ready to hire and doesn't ask to book directly through you: "Just fill out our contact form at wfy.co.in/contact and we'll take it from there!"
    If a question is unrelated to WebForYou or web development, politely redirect.

    Use the CONTEXT provided below to answer accurately. If the context does not
    contain the answer, escalate as described above.
""").strip()

FALLBACK = (
    "Good question! I don't have the exact answer for that, but our team definitely will. "
    "Fill out the contact form at wfy.co.in/contact and we'll get back to you within 24 hours! 😊"
)

# ── Build / load ChromaDB collection ─────────────────────────────────────────
_CHROMA_PATH = Path(__file__).parent / "chroma_db"
_CHROMA_PATH.mkdir(exist_ok=True)

_chroma = chromadb.PersistentClient(path=str(_CHROMA_PATH))
_embed_fn = LocalEmbeddingFunction()


def _get_or_build_collection() -> chromadb.Collection:
    from knowledge_base import DOCUMENTS, METADATAS  # type: ignore[import]

    existing = [c.name for c in _chroma.list_collections()]

    if COLLECTION_NAME in existing:
        col = _chroma.get_collection(name=COLLECTION_NAME, embedding_function=_embed_fn)
        log.info("Loaded ChromaDB collection '%s' (%d docs).", COLLECTION_NAME, col.count())
        return col

    log.info("Building ChromaDB collection '%s' from %d chunks…", COLLECTION_NAME, len(DOCUMENTS))
    col = _chroma.create_collection(
        name=COLLECTION_NAME,
        embedding_function=_embed_fn,
        metadata={"hnsw:space": "cosine"},
    )
    col.add(
        documents=DOCUMENTS,
        metadatas=METADATAS,
        ids=[f"doc_{i}" for i in range(len(DOCUMENTS))],
    )
    log.info("Collection built with %d chunks.", col.count())
    return col


_collection: chromadb.Collection = _get_or_build_collection()

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(title="WebForYou RAG Chatbot", version="2.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://www.wfy.co.in",
        "https://wfy.co.in",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)


# ── Pydantic models ───────────────────────────────────────────────────────────
class Message(BaseModel):
    role: Literal["user", "model"]
    text: str = Field(..., min_length=1, max_length=MAX_INPUT_CHARS)


class ChatRequest(BaseModel):
    messages: list[Message] = Field(..., min_length=1)


class ChatResponse(BaseModel):
    reply: str


# ── RAG helpers ───────────────────────────────────────────────────────────────
def _retrieve(query: str) -> str:
    """Return the top-K most relevant knowledge chunks as a formatted string."""
    n = min(TOP_K, _collection.count())
    if n == 0:
        return ""
    results = _collection.query(
        query_texts=[query],
        n_results=n,
        include=["documents"],
    )
    docs: list[str] = results.get("documents", [[]])[0]  # type: ignore[index]
    return "\n\n".join(f"[Context {i + 1}]\n{d}" for i, d in enumerate(docs))


def _build_contents(context: str, history: list[Message]) -> list[gtypes.Content]:
    """Build multi-turn content list for Gemini, injecting RAG context."""
    contents: list[gtypes.Content] = []

    # Past turns (everything except the last user message)
    for msg in history[:-1]:
        role = "user" if msg.role == "user" else "model"
        contents.append(gtypes.Content(role=role, parts=[gtypes.Part(text=msg.text)]))

    # Final user message — augment with retrieved context
    last_text = history[-1].text
    if context:
        augmented = (
            f"{SYSTEM_PROMPT}\n\n"
            f"--- Retrieved Context ---\n{context}\n--- End Context ---\n\n"
            f"User question: {last_text}"
        )
    else:
        augmented = f"{SYSTEM_PROMPT}\n\nUser question: {last_text}"

    contents.append(gtypes.Content(role="user", parts=[gtypes.Part(text=augmented)]))
    return contents


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {
        "status": "ok",
        "docs_indexed": _collection.count(),
        "embed_model": _ST_MODEL_NAME,
        "generate_model": GENERATE_MODEL,
    }


@app.post("/rebuild")
def rebuild():
    """Delete the existing collection and re-index from knowledge_base.py."""
    global _collection
    try:
        _chroma.delete_collection(name=COLLECTION_NAME)
    except Exception:
        pass
    _collection = _get_or_build_collection()
    return {"status": "rebuilt", "docs_indexed": _collection.count()}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    if req.messages[-1].role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from the user.")

    # Keep recent history only
    recent = req.messages[-(MAX_HISTORY * 2):]
    query  = recent[-1].text.strip()

    # ── Retrieval ──────────────────────────────────────────────────────────
    context = _retrieve(query)
    log.info("Query: %r  |  context: %d chars", query[:80], len(context))

    # ── Generation (with retry) ───────────────────────────────────────────
    contents = _build_contents(context, recent)
    reply = ""
    last_error = ""

    for attempt in range(MAX_RETRIES + 1):
        try:
            response = _genai_client.models.generate_content(
                model=GENERATE_MODEL,
                contents=contents,
                config=gtypes.GenerateContentConfig(
                    temperature=0.4,
                    top_p=0.9,
                    max_output_tokens=MAX_OUTPUT_TOKENS,
                ),
            )
            reply = (response.text or "").strip()
            break
        except Exception as exc:  # pylint: disable=broad-except
            last_error = str(exc)
            if "429" in last_error or "RESOURCE_EXHAUSTED" in last_error:
                wait = RETRY_DELAY * (2 ** attempt)
                log.warning("Rate limited (attempt %d/%d), retrying in %.1fs…", attempt + 1, MAX_RETRIES + 1, wait)
                time.sleep(wait)
                continue
            if "leaked" in last_error.lower() or "PERMISSION_DENIED" in last_error:
                log.error("API key is disabled — generate a new key at https://aistudio.google.com/apikey")
                break
            log.exception("Gemini generation failed: %s", exc)
            break

    if not reply and last_error:
        log.warning("Returning fallback. Last error: %s", last_error[:200])

    # Detect phone numbers in the generated reply and enforce escalation rule
    import re
    phone_pattern = re.compile(r"\+?\d{1,3}[\s-]?\d{3}[\s-]?\d{4}[\s-]?\d{0,4}")
    if phone_pattern.search(reply):
        # Replace the entire reply with escalation text
        reply = "ESCALATE: We are raising your ticket to the developers. Please enter your name and mobile number."
    return ChatResponse(reply=reply or FALLBACK)


# ── Entry point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=False)
