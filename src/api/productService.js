import { BASE_URL } from './config';

export const productService = {
  // Fetch products (optional category filter)
  getProducts: async (categoryId = null) => {
    const url = categoryId 
      ? `${BASE_URL}api/products.php?category=${categoryId}`
      : `${BASE_URL}api/products.php`;
    const response = await fetch(url);
    return response.json();
  },

  // Fetch categories for sidebar
  getCategories: async () => {
    const response = await fetch(`${BASE_URL}api/category.php`);
    return response.json();
  }
};



