import { NextResponse } from "next/server";
export async function GET() { return NextResponse.json({ ok: true, service: "vendor-reviews" }); }
export async function POST() { return NextResponse.json({ ok: true, service: "vendor-reviews" }); }
