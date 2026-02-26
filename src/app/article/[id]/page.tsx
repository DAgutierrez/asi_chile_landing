export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { headers } from "next/headers";
import Image from "next/image";
import { supabase } from "../../../../lib/supabaseClient";
import { User, Clock } from "lucide-react";
import { getCategories } from "../../data/newsdata";

type RouteProps = {
  // Next normalmente entrega params como objeto, pero lo soportamos si te llega Promise
  params: { id: string } | Promise<{ id: string }>;
};

async function getId(params: RouteProps["params"]) {
  const resolved = await Promise.resolve(params);
  return resolved.id;
}

// --- METADATA ---
export async function generateMetadata({ params }: RouteProps): Promise<Metadata> {
  const id = await getId(params);

  const { data, error } = await supabase
    .from("news")
    .select("title, content, excerpt")
    .eq("id", id)
    .single();

  if (error || !data) {
    return {
      title: "Noticia no encontrada",
      description: "No existe la noticia solicitada",
    };
  }

  const title = data.title;
  const description = (data.excerpt ?? data.content ?? "").slice(0, 150);

  // ✅ En tu setup, headers() es async
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  const baseUrl = host ? `${proto}://${host}` : "https://alternativasocialista.cl";

  const ogImageUrl = `${baseUrl}/api/og?id=${encodeURIComponent(id)}`;
  const articleUrl = `${baseUrl}/article/${encodeURIComponent(id)}`;

  return {
    title,
    description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title,
      description,
      url: articleUrl,
      type: "article",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

// --- PAGE ---
export default async function ArticlePage({ params }: RouteProps) {
  const id = await getId(params);

  const { data, error } = await supabase
    .from("news")
    .select(
      "id, title, excerpt, content, image_url, created_at, published_at, category_id, client_id"
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    console.error("Error cargando artículo:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Artículo no encontrado
        </h2>
        <p className="text-gray-600">
          No pudimos encontrar el artículo que estás buscando.
        </p>
      </div>
    );
  }

  const categories = await getCategories();
  const category = categories.find((cat) => cat.id === data.category_id);
  const categoryName = category?.name ?? "Sin categoría";

  let clientName = "Anónimo";
  if (data.client_id) {
    const { data: client } = await supabase
      .from("clients")
      .select("id, name")
      .eq("id", data.client_id)
      .single();
    clientName = client?.name ?? "Anónimo";
  }

  const displayDate = new Date(
    data.published_at || data.created_at
  ).toLocaleDateString("es-ES");

  return (
    <article className="max-w-4xl mx-auto px-4">
      <header className="mb-8">
        <span className="inline-block px-3 py-1 bg-red-700 text-white text-xs font-medium rounded-md mb-4">
          {categoryName}
        </span>

        <h1 className="text-4xl md:text-5xl font-bold font-serif leading-tight mb-4">
          {data.title}
        </h1>

        <div className="flex items-center text-gray-600 space-x-4 text-sm">
          <span className="flex items-center">
            <User size={16} className="mr-1" />
            {clientName}
          </span>
          <span className="flex items-center">
            <Clock size={16} className="mr-1" />
            {displayDate}
          </span>
        </div>
      </header>

      {/* ✅ IMAGEN REAL DEL ARTÍCULO */}
      {data.image_url && (
        <figure className="mb-8 relative w-full h-[400px]">
          <Image
            src={data.image_url}
            alt={data.title}
            fill
            className="object-cover rounded-lg"
          />
        </figure>
      )}

      {data.excerpt && (
        <div className="text-xl text-gray-600 mb-8 font-serif italic">
          {data.excerpt}
        </div>
      )}

      <div className="prose prose-lg max-w-none">
        {data.content?.split("\n").map((paragraph: string, index: number) => (
          <p key={index} className="mb-4 text-gray-800">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}