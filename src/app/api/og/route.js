export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import sharp from "sharp";

function fallbackJpg() {
  return sharp({
    create: {
      width: 1200,
      height: 630,
      channels: 3,
      background: { r: 20, g: 20, b: 20 },
    },
  })
    .jpeg({ quality: 80 })
    .toBuffer();
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  try {
    if (!id) {
      const jpg = await fallbackJpg();
      return new Response(jpg, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const { data, error } = await supabase
      .from("news")
      .select("image_url")
      .eq("id", id)
      .single();

    if (error || !data?.image_url) {
      const jpg = await fallbackJpg();
      return new Response(jpg, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const res = await fetch(data.image_url, { cache: "no-store" });
    if (!res.ok) {
      const jpg = await fallbackJpg();
      return new Response(jpg, {
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": "no-store, max-age=0",
        },
      });
    }

    const buffer = await res.arrayBuffer();

    const jpg = await sharp(Buffer.from(buffer))
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 80 })
      .toBuffer();

    return new Response(jpg, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(jpg.length),
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (err) {
    console.error("OG error:", err);
    const jpg = await fallbackJpg();
    return new Response(jpg, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  }
}