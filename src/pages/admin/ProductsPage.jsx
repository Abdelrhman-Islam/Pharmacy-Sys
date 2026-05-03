import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../api/config";
import "../../layouts/admin/Products.css";
import { toast } from "react-toastify/unstyled";

const Products = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = () => {
    fetch(`${BASE_URL}api/admin/products/get_products.php`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setProducts(data.data);
        }
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ✏️ Edit
  const handleEdit = (product) => {
    navigate("/admin/edit-product", {
      state: { product },
    });
  };

  // 🗑️ Delete
  const handleDelete = async (id) => {
    //if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}api/admin/products/delete_product.php`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ product_id: id }),
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        toast.success("Product deleted successfully");

        // 🧠 remove from UI without reload
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="products-container">
      <h2>Products</h2>

      <table>
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <img src={`${BASE_URL}/uploads/products/${p.pic}`} />
              </td>

              <td>{p.name}</td>
              <td>{p.price} EGP</td>
              <td>{p.qty}</td>

              <td>
                <button className="btn edit" onClick={() => handleEdit(p)}>
                  Edit
                </button>

                <button className="btn delete" onClick={() => handleDelete(p.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;