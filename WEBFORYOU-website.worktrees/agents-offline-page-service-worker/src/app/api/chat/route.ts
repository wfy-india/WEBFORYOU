import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy: Next.js  →  Python RAG chatbot (localhost:8001)
 *
 * The Python server is the source of truth for RAG + generation.
 * This route keeps the Python server URL hidden from the browser.
 */

import { buildGeminiRequest } from "@/lib/chatbotPrompt";

const PYTHON_CHATBOT_URL =
  process.env.PYTHON_CHATBOT_URL || "http://localhost:8001/chat";

const FALLBACK_REPLY =
  "Good question! I don't have the exact answer for that, but our team definitely will. " +
  "Fill out the contact form and we'll get back to you within 24 hours! 😊";

type IncomingMessage = {
  role?: unknown;
  text?: unknown;
};

function normalizeMessages(raw: IncomingMessage[]) {
  return raw
    .filter(
      (m): m is { role: "user" | "model"; text: string } =>
        (m.role === "user" || m.role === "model") &&
        typeof m.text === "string" &&
        m.text.trim().length > 0,
    )
    .slice(-12)
    .map((m) => ({ role: m.role, text: m.text.trim().slice(0, 800) }));
}

async function directGeminiFallback(messages: { role: "user" | "model"; text: string }[]): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[chat proxy fallback] GEMINI_API_KEY is not set in environment.");
    return null;
  }
  
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  try {
    const payload = buildGeminiRequest(messages);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(15_000),
    });
    
    if (!res.ok) {
      const err = await res.text();
      console.error("[chat proxy fallback] Gemini API direct call failed", res.status, err);
      return null;
    }
    
    const data = await res.json() as {
      candidates?: {
        content?: {
          parts?: { text?: string }[];
        };
      }[];
    };
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return reply ? reply.trim() : null;
  } catch (err) {
    console.error("[chat proxy fallback] Error during direct Gemini API call:", err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  let body: { messages?: IncomingMessage[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = normalizeMessages(
    Array.isArray(body.messages) ? body.messages : [],
  );

  if (!messages.length || messages[messages.length - 1].role !== "user") {
    return NextResponse.json(
      { error: "At least one user message is required." },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(PYTHON_CHATBOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      // 15-second timeout so slow embedding calls don't hang the page
      signal: AbortSignal.timeout(15_000),
    });

    if (upstream.ok) {
      const data = (await upstream.json()) as { reply?: string };
      let reply = data.reply || FALLBACK_REPLY;
      // Detect phone numbers in the reply and enforce escalation
      const phoneRegex = /\+?\d{1,3}[\s-]?\d{3}[\s-]?\d{4}[\s-]?\d{0,4}/;
      if (phoneRegex.test(reply)) {
        reply = "ESCALATE: We are raising your ticket to the developers. Please enter your name and mobile number.";
      }
      return NextResponse.json({ reply });
    }

    const err = await upstream.text();
    console.error("[chat proxy] Python server error", upstream.status, err);
  } catch (error) {
    console.error("[chat proxy] Failed to reach Python RAG server:", error);
  }

  // Graceful Fallback: Query Gemini Direct
  console.log("[chat proxy] Attempting direct Gemini API fallback...");
  const fallbackReply = await directGeminiFallback(messages);
  if (fallbackReply) {
    return NextResponse.json({ reply: fallbackReply });
  }

  return NextResponse.json(
    {
      reply:
        "I couldn't connect for a moment. Please try again, or fill out the contact form and we'll get back to you within 24 hours! 😊",
    },
    { status: 502 },
  );
}
