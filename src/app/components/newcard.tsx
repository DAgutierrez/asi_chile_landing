import { Clock, User } from 'lucide-react';
import Link from "next/link";
import { Article } from '../types';
import Image from 'next/image';
import '../globals.css'

interface NewsCardProps {
  article: Article;
  compact?: boolean;
}

const NewCard: React.FC<NewsCardProps> = ({ article, compact = false }) => {
  return (
    <article
      className={`bg-white rounded-lg overflow-hidden shadow-sm flex
        transition-transform duration-300 ease-in-out
                hover:-translate-y-2 hover:shadow-lg 
        ${
        compact ? '' : 'flex-col'
      }`}
    >
      {/* Image */}
      <div className={`relative ${compact ? 'w-1/3 flex-shrink-0' : 'w-full'} ${compact ? 'h-32' : 'h-48'}`}>
        <Image
          src={
            article.image_url ||
            'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg'
          }
          alt={article.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className={`p-4 ${compact ? 'w-2/3' : 'w-full'}`}>
        <div className="flex items-center mb-2">
          {article.category && (
            <span className="text-xs font-medium px-2 py-0.5 bg-[#DBEAFE] text-[#1E3A8A] rounded">
              {article.category.name}
            </span>
          )}
          {!compact && (
            <span className="ml-auto text-xs text-gray-500 flex items-center">
              <Clock size={12} className="mr-1" />
              {new Date(article.published_at).toLocaleDateString('es-ES')}
            </span>
          )}
        </div>

        <h3
          className={`font-bold font-serif text-gray-900 mb-2 text-balance ${
            compact ? 'text-base' : 'text-lg'
          }`}
        >
          <Link
            href={`/article/${article.id}`}
            className="hover:text-[#2563EB] transition-colors"
          >
            {article.title}
          </Link>
        </h3>

        {!compact && article.excerpt && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 text-balance">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          {article.client && (
            <span className="flex items-center">
              <User size={12} className="mr-1" />
              {article.client.name}
            </span>
          )}

          {compact && (
            <span className="flex items-center">
              <Clock size={12} className="mr-1" />
              {new Date(article.published_at).toLocaleDateString('es-ES')}
            </span>
          )}

          <Link
            href={`/article/${article.id}`}
            className="text-[#DC2626] hover:text-[#B91C1C] font-medium transition-colors"
          >
            Leer más
          </Link>
        </div>
      </div>
    </article>
  );
};

export default NewCard;