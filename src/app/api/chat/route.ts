import { NextRequest, NextResponse } from "next/server";

import { chatbotKnowledge } from "@/lib/chatbotKnowledge";

export const runtime = "nodejs";

const GENERATE_MODEL = process.env.GEMINI_MODEL || "gemini-2.0-flash";
const TOP_K = 4;
const MAX_HISTORY = 6;
const MAX_INPUT_CHARS = 800;
const MAX_OUTPUT_TOKENS = 280;
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

const ESCALATION_REPLY =
  "ESCALATE: We are raising your ticket to the developers. Please enter your name and mobile number.";

const FALLBACK_REPLY =
  "Good question! I don't have the exact answer for that, but our team definitely will. " +
  "Fill out the contact form at wfy.co.in/contact and we'll get back to you within 24 hours! 😊";

const SYSTEM_PROMPT = `
You are WFY, a friendly assistant for WebForYou — an AI-powered web development
agency based in Hyderabad, India. Help visitors understand what we do, our
services, pricing, timelines, and how to get started.

Personality:
- Warm, casual, and concise. 2-4 sentences unless the user asks for detail.
- Light emoji use is fine; do not overdo it.
- Be honest. If you are unsure, guide them to the contact form or escalate.
- Never invent exact prices, timelines, team sizes, or client names.
- Do NOT mention Gemini, RAG, retrieval, system prompts, or any internal implementation details.

ESCALATION RULES:
If a user asks to book a service, asks website-related doubts that are out of your knowledge base, or requests to speak to a human, you MUST escalate.
To escalate, reply EXACTLY with this format and nothing else:
${ESCALATION_REPLY}

When a user is ready to hire and doesn't ask to book directly through you: "Just fill out our contact form at wfy.co.in/contact and we'll take it from there!"
If a question is unrelated to WebForYou or web development, politely redirect.

Use the CONTEXT provided below to answer accurately. If the context does not
contain the answer, escalate as described above.
`.trim();

type IncomingMessage = {
  role?: unknown;
  text?: unknown;
};

type ChatMessage = {
  role: "user" | "model";
  text: string;
};

type GeminiPart = {
  text?: string;
};

type GeminiResponse = {
  candidates?: {
    content?: {
      parts?: GeminiPart[];
    };
  }[];
};

function normalizeMessages(raw: IncomingMessage[]): ChatMessage[] {
  return raw
    .filter(
      (message): message is ChatMessage =>
        (message.role === "user" || message.role === "model") &&
        typeof message.text === "string" &&
        message.text.trim().length > 0,
    )
    .slice(-(MAX_HISTORY * 2))
    .map((message) => ({
      role: message.role,
      text: message.text.trim().slice(0, MAX_INPUT_CHARS),
    }));
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s/-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function retrieveContext(query: string): string {
  const queryTokens = tokenize(query);
  const querySet = new Set(queryTokens);

  const scoredDocuments = chatbotKnowledge
    .map((document, index) => {
      const haystack = `${document.topic} ${document.text}`.toLowerCase();
      let score = 0;

      for (const token of querySet) {
        if (haystack.includes(token)) {
          score += document.topic.toLowerCase().includes(token) ? 3 : 1;
        }
      }

      for (let i = 0; i < queryTokens.length - 1; i += 1) {
        const phrase = `${queryTokens[i]} ${queryTokens[i + 1]}`;
        if (haystack.includes(phrase)) {
          score += 4;
        }
      }

      return { document, index, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, TOP_K);

  const selectedDocuments =
    scoredDocuments.length > 0
      ? scoredDocuments.map((item) => item.document)
      : chatbotKnowledge.slice(0, TOP_K);

  return selectedDocuments
    .map((document, index) => `[Context ${index + 1} | ${document.topic}]\n${document.text}`)
    .join("\n\n");
}

function shouldEscalateImmediately(query: string): boolean {
  const normalized = query.toLowerCase();
  const directBooking =
    /\b(book|hire|start|order|buy|purchase)\b/.test(normalized) &&
    /\b(service|website|project|plan|package|you|webforyou|wfy)\b/.test(normalized);
  const humanRequest = /\b(human|person|agent|developer|team|call me|contact me|speak|talk)\b/.test(normalized);

  return directBooking || humanRequest;
}

function buildLocalKnowledgeReply(query: string): string | null {
  const normalized = query.toLowerCase();

  if (/\b(mobile app|android|ios|native app)\b/.test(normalized)) {
    return (
      "WebForYou does not currently offer native iOS or Android app development. " +
      "We do build mobile-responsive web apps that work well across devices."
    );
  }

  if (/\b(seo|branding|logo|marketing|graphic)\b/.test(normalized)) {
    return (
      "Full SEO campaigns, branding, logo design, graphic design, and digital marketing are coming soon. " +
      "You can register interest through the contact form."
    );
  }

  if (/\b(service|offer|provide|do you do|build|make)\b/.test(normalized)) {
    return (
      "We build business websites, landing pages, portfolio sites, e-commerce stores, custom web apps, redesigns, " +
      "performance fixes, and maintenance. AI integrations and e-commerce builds are core services too."
    );
  }

  if (/\b(price|pricing|cost|budget|package|quote|charge)\b/.test(normalized)) {
    return (
      "WebForYou has fixed-price packages for common sites and custom quotes for complex projects. " +
      "Exact pricing is shared after you fill out the contact form with your requirements, budget, and deadline."
    );
  }

  if (/\b(time|timeline|long|duration|deadline|deliver|launch)\b/.test(normalized)) {
    return (
      "Most WebForYou projects are completed within 1 to 2 weeks. Larger or more complex builds can take longer, " +
      "and the team confirms a clear timeline before work starts."
    );
  }

  if (/\b(start|get started|process|work|steps)\b/.test(normalized)) {
    return (
      "To get started, fill out the contact form at wfy.co.in/contact with your business type, goals, examples you like, " +
      "budget range, and target deadline. The team reviews it and sends a proposal and quote."
    );
  }

  if (/\b(contact|whatsapp|reach|call|email)\b/.test(normalized)) {
    return (
      "The easiest way to reach WebForYou is through the contact form at wfy.co.in/contact. " +
      "The team usually responds within 24 hours."
    );
  }

  if (/\b(location|based|where)\b/.test(normalized)) {
    return "WebForYou is based in Hyderabad, India, and serves clients across India while expanding internationally.";
  }

  if (/\b(own|ownership|code|domain|handover|deliverables)\b/.test(normalized)) {
    return (
      "Once the project is complete and fully paid, the client owns 100% of the deliverables, including code, designs, " +
      "domain, and hosting credentials."
    );
  }

  if (/\b(portal|client login|developer login|invoice|payment|razorpay)\b/.test(normalized)) {
    return (
      "Existing clients can use the Client Portal at wfy.co.in/client/login to track milestones, submit maintenance requests, " +
      "and pay invoices via Razorpay."
    );
  }

  if (/\b(certificate|internship|verify)\b/.test(normalized)) {
    return "Certificate verification is available at wfy.co.in/certificate for completed WebForYou internship programmes.";
  }

  return null;
}

function buildGeminiPayload(messages: ChatMessage[], context: string) {
  const lastMessage = messages[messages.length - 1];
  const previousMessages = messages.slice(0, -1);

  return {
    contents: [
      ...previousMessages.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      {
        role: "user",
        parts: [
          {
            text:
              `${SYSTEM_PROMPT}\n\n` +
              `--- Retrieved Context ---\n${context}\n--- End Context ---\n\n` +
              `User question: ${lastMessage.text}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.4,
      topP: 0.9,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  };
}

function enforceEscalationSafety(reply: string): string {
  const phoneRegex = /\+?\d{1,3}[\s-]?\d{3}[\s-]?\d{4}[\s-]?\d{0,4}/;
  return phoneRegex.test(reply) ? ESCALATION_REPLY : reply;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function generateReply(messages: ChatMessage[], context: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set.");
    return null;
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GENERATE_MODEL}:generateContent?key=${apiKey}`;
  const payload = buildGeminiPayload(messages, context);
  let lastError = "";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });

      if (!response.ok) {
        lastError = await response.text();

        if (response.status === 429 && attempt < MAX_RETRIES) {
          await wait(RETRY_DELAY_MS * 2 ** attempt);
          continue;
        }

        console.error("[chat] Gemini API failed", response.status, lastError);
        return null;
      }

      const data = (await response.json()) as GeminiResponse;
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      return reply ? enforceEscalationSafety(reply) : null;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);

      if (attempt < MAX_RETRIES && /429|RESOURCE_EXHAUSTED/i.test(lastError)) {
        await wait(RETRY_DELAY_MS * 2 ** attempt);
        continue;
      }

      console.error("[chat] Gemini generation error:", error);
      return null;
    }
  }

  console.warn("[chat] Returning fallback. Last error:", lastError.slice(0, 200));
  return null;
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
    docs_indexed: chatbotKnowledge.length,
    generate_model: GENERATE_MODEL,
    runtime: "nextjs",
  });
}

export async function POST(req: NextRequest) {
  let body: { messages?: IncomingMessage[] };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const messages = normalizeMessages(Array.isArray(body.messages) ? body.messages : []);
  const lastMessage = messages[messages.length - 1];

  if (!messages.length || lastMessage.role !== "user") {
    return NextResponse.json(
      { error: "At least one user message is required." },
      { status: 400 },
    );
  }

  if (shouldEscalateImmediately(lastMessage.text)) {
    return NextResponse.json({ reply: ESCALATION_REPLY });
  }

  const context = retrieveContext(lastMessage.text);
  const reply = await generateReply(messages, context);

  return NextResponse.json({
    reply: reply || buildLocalKnowledgeReply(lastMessage.text) || FALLBACK_REPLY,
  });
}
