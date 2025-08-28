'use client';

import "./globals.css";
import React, { useState, useEffect } from 'react';
import FeaturedNews from './components/featurednews';
import NewsSection from './components/newsection';
import { getCategories } from './data/newsdata';
import type { Category } from './types';

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  return (
    <div className="px-4 md:px-8 lg:px-16" style={{padding: "0px 38px"}}>
      <FeaturedNews />

      <NewsSection 
        title="Últimas Noticias" 
        category="latest" 
        className="mt-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {categories.map(category => (
          <NewsSection 
            key={category.id}
            title={category.name} 
            category={category.slug || category.name.toLowerCase().replace(/\s+/g, '-')}
            compact
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;