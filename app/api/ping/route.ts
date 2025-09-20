// /app/api/ping/route.ts
import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase.admin";

export async function GET() {
  try {
    // Hacer una consulta mínima para probar permisos y conexión
    const snap = await adminDb.collection("pigs").limit(1).get();
    return NextResponse.json({
      ok: true,
      collection: "pigs",
      count: snap.size,
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || "error" }, { status: 500 });
  }
}
