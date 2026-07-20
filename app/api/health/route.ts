import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    app: "On Par Marketing Roadmap",
    phase: "Phase 1 foundation",
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    authConfigured: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET)
  });
}
