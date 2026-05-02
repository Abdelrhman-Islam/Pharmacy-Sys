import React from 'react';
import { BASE_URL } from '../api/config';
import { useCart } from '../context/CartContext';


const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={`${BASE_URL}uploads/products/${product.pic}`} 
          alt={product.name} 
         
        />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-price">{product.price} ج.م</p>
      </div>

      <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
        أضف للسلة
      </button>
    </div>
  );
};
export default ProductCard;