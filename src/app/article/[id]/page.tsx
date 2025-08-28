export const dynamic = 'force-dynamic';
import { supabase } from '../../../../lib/supabaseClient';
import { User, Clock } from 'lucide-react';
import { getCategories } from '../../data/newsdata'; 

interface RouteProps {
  params: Promise<{ id: string }>; // <- si tu runtime lo pide como Promise
}

// --- METADATA ---
export async function generateMetadata({ params }: RouteProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('news')
    .select('title, content, image_url, created_at')
    .eq('id', id) // fuerza a número si tu id es int en DB
    .single();

  if (error || !data) {
    return {
      title: 'Noticia no encontrada',
      description: 'No existe la noticia solicitada',
    };
  }

  const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?id=${id}`;

  return {
    title: data.title,
    description: data.content?.slice(0, 150) ?? '',
    openGraph: {
      title: data.title,
      description: data.content?.slice(0, 150) ?? '',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?id=${id}`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      type: 'article',
    },
  };
}

// --- PAGE ---
export default async function ArticlePage({ params }: RouteProps) {
  const { id } = await params;

  // 1) Trae el artículo base (sin relaciones)
  const { data, error } = await supabase
    .from('news')
    .select(
      'id, title, excerpt, content, image_url, created_at, published_at, category_id, client_id'
    )
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error cargando artículo:', error);
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

  // 2) 

  const categories = await getCategories();
  const category = categories.find(cat => cat.id === data.category_id);
  const categoryName = category?.name ?? 'Sin categoría';
  
  let clientName = 'Anónimo';
  if (data.client_id) {
    const { data: client } = await supabase
      .from('clients')
      .select('id, name')
      .eq('id', data.client_id)
      .single();
    clientName = client?.name ?? 'Anónimo';
  }

  const displayDate = new Date(
    data.published_at || data.created_at
  ).toLocaleDateString('es-ES');

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

      {data.image_url && (
        <figure className="mb-8">
          {/* Usas tu transformador a PNG/JPG */}
          <img
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/api/og?id=${id}`}
            alt={data.title}
            className="w-full h-[400px] object-cover rounded-lg"
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
