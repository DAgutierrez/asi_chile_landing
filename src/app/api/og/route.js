import { NextResponse } from "next/server";
import { supabase } from '../../../../lib/supabaseClient';
import sharp from "sharp";

export async function GET(req) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const { data, error } = await supabase
    .from("news") 
    .select("image_url")
    .eq("id", id)
    .single();
    // .range(0,0); // que fila tomar

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { error: "No hay imágenes en la tabla" },
      { status: 404 }
    );
  }

  const imageUrl = data.image_url;
  console.log(imageUrl)

  try {
    const res = await fetch(imageUrl);
    const buffer = await res.arrayBuffer();

    const png = await sharp(Buffer.from(buffer)).png().toBuffer();

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Content-Length": String(png.length),
        "Cache-Control": "public, max-age=604800, immutable",
      },
    });
  } catch (err) {
    console.error("Error procesando la imagen:", err);
    return NextResponse.json(
      { error: "Error al generar la imagen" },
      { status: 500 }
    );
  }
}
