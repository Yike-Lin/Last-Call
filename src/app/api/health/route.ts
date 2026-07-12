import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "last-call",
    timestamp: new Date().toISOString()
  });
}
