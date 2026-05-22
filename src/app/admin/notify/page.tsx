"use client";
import { useState } from "react";

export default function AdminNotify() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [status, setStatus] = useState("");

  async function sendNotification() {
    setStatus("Sending...");
    const res = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });
    setStatus(res.ok ? "✅ Sent!" : "❌ Failed");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md flex flex-col gap-4">
        <h1 className="text-xl font-semibold text-slate-900">Send Notification</h1>
        <input
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="border border-slate-200 rounded-lg px-4 py-2 text-sm"
          placeholder="Message"
          rows={3}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <button
          onClick={sendNotification}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-2 text-sm font-medium transition-colors"
        >
          Send to All Users
        </button>
        {status && <p className="text-center text-sm text-slate-500">{status}</p>}
      </div>
    </div>
  );
}