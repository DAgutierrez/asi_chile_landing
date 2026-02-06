'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import NewCard from './newcard';
import { getNewsByCategory } from '../data/newsdata';
import type { Article } from '../types';


interface NewsSectionProps {
  title: string;
  category: string;
  compact?: boolean;
  className?: string;
}

const NewSection: React.FC<NewsSectionProps> = ({
  title,
  category,
  compact = false,
  className = '',
}) => {
  const [visibleItems, setVisibleItems] = useState(compact ? 3 : 6);
  const [news, setNews] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getNewsByCategory(category);
        setNews(data);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('No se pudieron cargar las noticias en este momento');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]);

  const handleLoadMore = () => {
    setVisibleItems(prev => prev + (compact ? 3 : 6));
  };

  if (loading) {
    return (
      <div className="animate-pulse p-4 space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!loading && news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se encontraron artículos para {title}</p>
      </div>
    );
  }

  return (
    <section className={`${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold font-serif text-gray-900">{title}</h2>
        <Link
          href={`/category/${category}`}
          className="flex items-center text-[#2563EB] hover:text-[#1E3A8A] transition-colors text-sm font-medium"
        >
          Ver Todo <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>

      <div
        className={`grid gap-6 ${
          compact ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {news.slice(0, visibleItems).map(item => (
          <NewCard key={item.id} article={item} compact={compact} />
        ))}
      </div>

      {visibleItems < news.length && (
        <div className="mt-8 text-center">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors"
          >
            Cargar Más
          </button>
        </div>
      )}
    </section>
  );
};

export default NewSection;