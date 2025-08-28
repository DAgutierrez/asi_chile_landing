export interface Client {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  category_id: string;
  client_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  client_id: string;
  subcategories?: Subcategory[];
}

export interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  client_id: string;
  category_id: string;
  subcategory_id?: string;
  created_at: string;
  published_at: string;
  category?: Category;
  client?: Client;
}