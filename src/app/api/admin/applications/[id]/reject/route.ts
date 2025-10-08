import { supabaseAdmin } from "../../../../../../lib/supabaseAdmin";
import { requireAdmin } from "../../../../../../lib/adminAuth";

// ✅ Compatible with Next.js 15
export async function POST(req, context) {
  try {
    requireAdmin(req);

    const supa = supabaseAdmin();
    const appId = context.params?.id; // ✅ Correct reference

    if (!appId) {
      return Response.json({ error: "Missing ID parameter" }, { status: 400 });
    }

    // 1️⃣ Update the application's status to "rejected"
    const { error } = await supa
      .from("vendor_applications")
      .update({ status: "rejected" })
      .eq("id", appId);

    if (error) {
      return Response.json({ ok: false, error: error.message }, { status: 500 });
    }

    return Response.json({ ok: true, message: "Application rejected" });
  } catch (err) {
    console.error("Reject route error:", err);
    return Response.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
