"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Send, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
};

const starterPrompts = [
  "How much does a website cost?",
  "How long will my project take?",
  "What services do you offer?",
];

const welcomeMessage: ChatMessage = {
  id: "welcome",
  role: "model",
  text: "Hi! I'm WFY. Ask me about websites, pricing, timelines, or getting started with WebForYou.",
};

const chatbotIconSrc = "/chatbot-icon.png";

function createMessage(role: ChatMessage["role"], text: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    text,
  };
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [isSending, setIsSending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ticket form state
  const [ticketName, setTicketName] = useState("");
  const [ticketMobile, setTicketMobile] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState<Record<string, boolean>>({});

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isSending]);

  const apiMessages = useMemo(
    () =>
      messages
        .filter((message) => message.id !== "welcome")
        .map((message) => ({
          role: message.role,
          text: message.text,
        })),
    [messages],
  );

  async function sendMessage(text: string) {
    const trimmedText = text.trim();

    if (!trimmedText || isSending) {
      return;
    }

    const nextUserMessage = createMessage("user", trimmedText);
    const nextMessages = [...apiMessages, { role: "user" as const, text: trimmedText }];

    setMessages((currentMessages) => [...currentMessages, nextUserMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data: { reply?: string; error?: string } = await response.json();
      const reply =
        data.reply ||
        "Good question! I don't have the exact answer for that, but our team definitely will. Fill out the contact form and we'll get back to you within 24 hours! 😊";

      setMessages((currentMessages) => [...currentMessages, createMessage("model", reply)]);
    } catch {
      setMessages((currentMessages) => [
        ...currentMessages,
        createMessage(
          "model",
          "I couldn't connect for a moment. Please try again, or fill out the contact form and we'll get back to you within 24 hours! 😊",
        ),
      ]);
    } finally {
      setIsSending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  async function handleTicketSubmit(messageId: string, userQuery: string, aiResponse: string) {
    if (!ticketName || !ticketMobile) return;

    try {
      await fetch('/api/developer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_ticket',
          name: ticketName,
          mobile: ticketMobile,
          user_query: userQuery,
          ai_response: aiResponse
        })
      });
      setTicketSubmitted(prev => ({ ...prev, [messageId]: true }));
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="flex h-[min(620px,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-lg border border-white/12 bg-neutral-950 shadow-2xl shadow-black/50">
          <header className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/95 p-1 shadow-sm">
                <img
                  src={chatbotIconSrc}
                  alt=""
                  className="h-full w-full object-contain"
                  aria-hidden="true"
                />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">WFY Assistant</p>
                <p className="truncate text-xs text-white/55">WebForYou</p>
              </div>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 text-white/70 hover:bg-white/10 hover:text-white"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </header>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => {
              const isEscalation = message.role === "model" && message.text.includes("ESCALATE:");
              const displayMessage = isEscalation ? message.text.replace("ESCALATE:", "").trim() : message.text;
              const prevUserMessage = messages[index - 1]?.text || "Unknown query";

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-2",
                    message.role === "user" ? "items-end" : "items-start",
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-relaxed",
                      message.role === "user"
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/[0.06] text-white/88",
                    )}
                  >
                    {displayMessage}
                  </div>
                  
                  {isEscalation && !ticketSubmitted[message.id] && (
                    <div className="w-[85%] rounded-lg border border-white/10 bg-black/40 p-3 space-y-3">
                      <p className="text-xs font-semibold text-white/70">Contact Details</p>
                      <input 
                        type="text" 
                        placeholder="Your Name" 
                        value={ticketName}
                        onChange={e => setTicketName(e.target.value)}
                        className="w-full rounded text-sm bg-white/5 border border-white/10 px-2 py-1.5 text-white outline-none focus:border-white/30"
                      />
                      <input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={ticketMobile}
                        onChange={e => setTicketMobile(e.target.value)}
                        className="w-full rounded text-sm bg-white/5 border border-white/10 px-2 py-1.5 text-white outline-none focus:border-white/30"
                      />
                      <Button 
                        size="sm" 
                        className="w-full bg-white text-black hover:bg-white/90 h-8 text-xs font-semibold"
                        onClick={() => handleTicketSubmit(message.id, prevUserMessage, displayMessage)}
                        disabled={!ticketName || !ticketMobile}
                      >
                        Submit Ticket
                      </Button>
                    </div>
                  )}

                  {isEscalation && ticketSubmitted[message.id] && (
                    <div className="w-[85%] rounded-lg border border-green-500/30 bg-green-500/10 p-2 text-center text-xs text-green-400">
                      Ticket raised! We will contact you soon.
                    </div>
                  )}
                </div>
              );
            })}

            {isSending && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white/70">
                  <Sparkles className="h-4 w-4 animate-pulse" aria-hidden="true" />
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="grid gap-2 border-t border-white/10 px-4 py-3">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-md border border-white/10 px-3 py-2 text-left text-sm text-white/75 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
                  onClick={() => void sendMessage(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <div className="border-t border-white/10 p-3">
            <form className="flex items-end gap-2" onSubmit={handleSubmit}>
              <textarea
                ref={inputRef}
                value={input}
                rows={1}
                maxLength={600}
                className="max-h-28 min-h-11 flex-1 resize-none rounded-md border border-white/10 bg-black px-3 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-white/30"
                placeholder="Ask WFY..."
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 bg-white text-black hover:bg-white/85"
                disabled={isSending || input.trim().length === 0}
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </Button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-3 text-xs text-white/45">
              <span>Exact quotes need the form.</span>
              <Link href="/contact" className="font-medium text-white/75 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </section>
      )}

      <Button
        type="button"
        className="h-16 gap-2 rounded-full bg-white py-2 pl-2.5 pr-5 text-black shadow-2xl shadow-black/40 hover:bg-white/85"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black text-white">
            <X className="h-5 w-5" aria-hidden="true" />
          </span>
        ) : (
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-100 p-1">
            <img
              src={chatbotIconSrc}
              alt=""
              className="h-full w-full object-contain"
              aria-hidden="true"
            />
          </span>
        )}
        <span className="text-sm font-semibold">Chat</span>
      </Button>
    </div>
  );
}
