

import { getNewsByCategory } from '../../../../data/newsdata';
import NewsCard from '../../../../components/newcard';
import type { Article } from '../../../../types';


interface CategoryPageProps {
  params: {
    categoryName: string;
    subcategoryId?: string;
    subcategoryName?: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryName, subcategoryId, subcategoryName } = await params;

  let data: Article[] = [];
  try {
    data = await getNewsByCategory(categoryName || "");
  } catch (err) {
    console.error("Error loading news:", err);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No se pudieron cargar las noticias
        </h2>
      </div>
    );
  }

  // Filtrado opcional por subcategoría
  const filteredNews = subcategoryId
    ? data.filter(
        (article) =>
          article.subcategory_id?.toLowerCase() ===
          subcategoryId.toLowerCase()
      )
    : data;

  if (!filteredNews.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          No se encontraron artículos
        </h2>
        <p className="text-gray-600">
          No hay artículos disponibles en {decodeURIComponent(subcategoryName || categoryName)}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold font-serif mb-8">
        {decodeURIComponent(subcategoryName || categoryName)}
      </h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredNews.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}