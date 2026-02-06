'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getFeaturedNews } from '../data/newsdata';
import type { Article } from '../types';

const FeaturedNews: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredNews, setFeaturedNews] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedNews = async () => {
      try {
        const news = await getFeaturedNews();
        setFeaturedNews(news);
      } catch (error) {
        console.error('Failed to load featured news:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedNews();
  }, []);

  useEffect(() => {
    if (featuredNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [featuredNews.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredNews.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  if (isLoading) {
    return (
      <section className="relative mt-4 rounded-xl overflow-hidden shadow-lg h-[500px] md:h-[600px] bg-gray-100 animate-pulse" />
    );
  }

  if (featuredNews.length === 0) return null;

  return (
    <section className="relative mt-4 rounded-xl overflow-hidden shadow-lg h-[500px] md:h-[600px]">
      {/* Carousel */}
      <div className="relative h-full">
        {featuredNews.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
            
            {/* Imagen con next/image */}
            <div className="relative w-full h-full">
              <Image
                src={item.image_url ||
                    'https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg'}
                alt={item.title}
                fill
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-20 text-white">
              {item.category && (
                <span className="inline-block px-3 py-1 bg-[#DC2626] text-white text-xs font-medium rounded-md mb-3">
                  {item.category.name}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif leading-tight mb-3 text-balance">
                {item.title}
              </h2>
              {item.excerpt && (
                <p className="text-base md:text-lg text-gray-200 mb-4 max-w-3xl text-balance">
                  {item.excerpt}
                </p>
              )}
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  {new Date(item.published_at).toLocaleDateString()}
                </span>
                {item.client && (
                  <span className="text-sm text-gray-300">By {item.client.name}</span>
                )}
                <Link
                  href={`/article/${item.id}`}
                  className="text-[#F87171] hover:text-[#FCA5A5] font-medium text-sm transition-colors"
                >
                  Leer más
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {featuredNews.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedNews;

