import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../layouts/ProductsPage.css';
import { productService } from '../api/productService';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const catRes = await productService.getCategories();
        setCategories(catRes.data);

        const prodRes = await productService.getProducts(selectedCat);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("حصلت مشكلة في سحب البيانات", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [selectedCat]); 

  return (
    <div className="page-wrapper">
  <Navbar />
  <div className="main-content">
    <aside className="filter-box">
      <h4>التصنيفات</h4>
      <ul>
        <li className={!selectedCat ? "active" : ""} onClick={() => setSelectedCat(null)}>الكل</li>
        {categories.map(cat => (
          <li key={cat.id} className={selectedCat === cat.id ? "active" : ""} onClick={() => setSelectedCat(cat.id)}>
            {cat.name}
          </li>
        ))}
      </ul>
    </aside>

    <main className="products-main">
      <div className="section-header">
        <h2>أحدث المنتجات</h2>
      </div>
      <div className="products-grid">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </main>
  </div>
  <Footer />
</div>
  );
};

export default ProductsPage;