import { supabase } from '../../../lib/supabaseClient';
import type { Article, Category } from '../types';

const CLIENT_ID = "4a64f6f0-bc3b-4420-9c53-37c2a9f4c357";

export const getCategories = async (): Promise<Category[]> => {
  const { data: categories, error: categoriesError } = await supabase
    .from('new_categories')
    .select('*')
    .eq('client_id', CLIENT_ID)
    .order('name');

  if (categoriesError) throw categoriesError;

  // Fetch subcategories for each category
  const { data: subcategories, error: subcategoriesError } = await supabase
    .from('subcategories')
    .select('*')
    .eq('client_id', CLIENT_ID);

  if (subcategoriesError) throw subcategoriesError;

  // Merge subcategories with their parent categories
  const categoriesWithSubs = categories.map(category => ({
    ...category,
    subcategories: subcategories.filter(sub => sub.category_id === category.id)
  }));

  return categoriesWithSubs || [];
};

export const getNewsByCategory = async (categoryName: string): Promise<Article[]> => {
  if (categoryName.toLowerCase() === 'latest') {
    return getLatestNews();
  }

  // First, get the category ID from the name
  const { data: categories, error: categoryError } = await supabase
    .from('new_categories')
    .select('id')
    .eq('client_id', CLIENT_ID)
    .ilike('name', categoryName);

  if (categoryError) throw categoryError;
  if (!categories || categories.length === 0) return [];

  // Then use the category ID to get the news
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:new_categories(*),
      client:clients(*)
    `)
    .eq('category_id', categories[0].id)
    .eq('client_id', CLIENT_ID)
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const getLatestNews = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:new_categories(*),
      client:clients(*)
    `)
    .eq('client_id', CLIENT_ID)
    .order('published_at', { ascending: false })
    .limit(12);

  if (error) throw error;
  return data || [];
};

export const getFeaturedNews = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:new_categories(*),
      client:clients(*)
    `)
    .eq('client_id', CLIENT_ID)
    .order('published_at', { ascending: false })
    .limit(3);

  if (error) throw error;
  return data || [];
};

export const getArticleById = async (id: string): Promise<Article> => {
  const { data, error } = await supabase
    .from('news')
    .select(`
      *,
      category:new_categories(*),
      client:clients(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Article not found');
  return data;
};