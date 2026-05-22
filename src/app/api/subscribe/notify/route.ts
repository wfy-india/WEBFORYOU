import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import fs from "fs";

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: NextRequest) {
  const { title, body } = await req.json();
  
  const subs = JSON.parse(fs.readFileSync("subscriptions.json", "utf8"));
  
  await Promise.all(
    subs.map((sub: any) =>
      webpush.sendNotification(sub, JSON.stringify({ title, body }))
    )
  );
  
  return NextResponse.json({ success: true });
}