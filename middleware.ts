import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const username = process.env.MARKETING_ROADMAP_USER;
  const password = process.env.MARKETING_ROADMAP_PASSWORD;

  if (!username || !password || request.nextUrl.pathname.startsWith("/api/health")) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");
  const expected = `Basic ${btoa(`${username}:${password}`)}`;

  if (authHeader === expected) {
    return NextResponse.next();
  }

  return new NextResponse("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="On Par Marketing Roadmap"'
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
