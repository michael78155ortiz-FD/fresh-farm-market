import crypto from "crypto";

/**
 * Verify the admin secret from the incoming Request headers.
 * Usage: requireAdmin(req)
 */
export function requireAdmin(req: Request) {
  const fromHeader = req.headers.get("x-admin-secret") || "";
  const expected = process.env.ADMIN_SECRET || "";

  const a = Buffer.from(fromHeader);
  const b = Buffer.from(expected);

  if (!expected || a.length !== b.length) {
    throw new Response("Unauthorized (bad secret)", { status: 401 });
  }
  const ok = crypto.timingSafeEqual(a, b);
  if (!ok) throw new Response("Unauthorized (bad secret)", { status: 401 });
}
