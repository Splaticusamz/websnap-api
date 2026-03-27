import { NextRequest, NextResponse } from "next/server";

// Placeholder — feature implementation comes in Phase 1 build
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Not implemented yet — infrastructure deploy. Check back soon!" },
    { status: 501 }
  );
}

export async function GET() {
  return NextResponse.json({
    endpoint: "POST /api/snap",
    body: { url: "string (required)" },
    description: "Submit a URL to receive structured JSON extraction.",
    status: "coming_soon",
  });
}
