import { NextResponse } from "next/server";
export async function POST() { return NextResponse.json({ ok: true, service: "vendor-follow" }); }
export async function DELETE() { return NextResponse.json({ ok: true, service: "vendor-follow" }); }
