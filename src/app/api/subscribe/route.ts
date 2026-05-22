import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  const subscription = await req.json();
  
  // Save subscription (use a database in production)
  const subs = JSON.parse(fs.readFileSync("subscriptions.json", "utf8") || "[]");
  subs.push(subscription);
  fs.writeFileSync("subscriptions.json", JSON.stringify(subs));
  
  return NextResponse.json({ success: true });
}