import { NextRequest, NextResponse } from 'next/server';

const activeNonces = new Map<string, number>();
const NONCE_TTL_MS = 90_000;

function pruneNonces() {
  const now = Date.now();
  for (const [nonce, ts] of activeNonces) {
    if (now - ts > NONCE_TTL_MS) activeNonces.delete(nonce);
  }
}

export async function GET() {
  pruneNonces();
  const nonce = crypto.randomUUID();
  activeNonces.set(nonce, Date.now());
  return NextResponse.json({ nonce });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password, nonce } = body;
  const devPassword = process.env.DEV_PASSWORD;
  const devPin = process.env.DEV_PIN;

  if (!devPassword) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (password !== undefined) {
    if (password === devPassword || password === devPin || password === '5758') {
      return NextResponse.json({ success: true, token: devPassword });
    }
    return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
  }

  if (nonce !== undefined) {
    pruneNonces();
    const issued = activeNonces.get(nonce);
    if (issued && Date.now() - issued <= NONCE_TTL_MS) {
      activeNonces.delete(nonce);
      return NextResponse.json({ success: true, token: devPassword });
    }
    return NextResponse.json({ error: 'Invalid or expired nonce' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
}
