import { supabaseAdmin } from "../../../../../../lib/supabaseAdmin";
import { requireAdmin } from "../../../../../../lib/adminAuth";

// ✅ Compatible with Next.js 15 — no manual type annotation on context
export async function POST(req, context) {
  try {
    requireAdmin(req);

    const supa = supabaseAdmin();
    const appId = context.params?.id; // ✅ use optional chaining for safety

    if (!appId) {
      return Response.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // 1️⃣ Load the application
    const { data: app, error: e1 } = await supa
      .from("vendor_applications")
      .select("*")
      .eq("id", appId)
      .single();

    if (e1 || !app) {
      return Response.json({ error: "Application not found" }, { status: 404 });
    }

    // 2️⃣ Approve vendor
    const { error: e2 } = await supa
      .from("vendor_applications")
      .update({ status: "approved" })
      .eq("id", appId);

    if (e2) throw e2;

    return Response.json({ ok: true, message: "Application approved" });
  } catch (err) {
    console.error("Approve route error:", err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
