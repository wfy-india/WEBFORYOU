"use client";

export default function NotificationButton() {
  async function subscribeUser() {
    const reg = await navigator.serviceWorker.ready;
    
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify(sub),
      headers: { "Content-Type": "application/json" },
    });

    alert("Notifications enabled!");
  }

  return (
    <button onClick={subscribeUser}>Enable Notifications</button>
  );
}