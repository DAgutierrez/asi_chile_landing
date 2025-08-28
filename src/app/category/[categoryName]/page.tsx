import { getNewsByCategory } from "../../data/newsdata";
import NewsCard from "../../components/newcard";
import type { Article } from "../../types";

interface Props {
  params: { categoryName: string };
}

export default async function CategoryPage({ params }: Props) {
  const { categoryName } = await params;

  let articles: Article[] = [];
  try {
    articles = await getNewsByCategory(categoryName || "");
  } catch (err) {
    console.error("Error cargando artículos:", err);
  }

  if (!articles.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold">No se encontraron artículos</h2>
        <p>No hay artículos disponibles en {decodeURIComponent(categoryName)}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">{decodeURIComponent(categoryName)}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
