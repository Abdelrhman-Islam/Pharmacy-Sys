import { BASE_URL } from './config';

export const productService = {
  // سحب كل المنتجات أو فلترتها بالتصنيف
  getProducts: async (categoryId = null) => {
    const url = categoryId 
      ? `${BASE_URL}api/products.php?category=${categoryId}`
      : `${BASE_URL}api/products.php`;
    const response = await fetch(url);
    return response.json();
  },

  // سحب قائمة التصنيفات للـ Sidebar
  getCategories: async () => {
    const response = await fetch(`${BASE_URL}api/category.php`);
    return response.json();
  }
};