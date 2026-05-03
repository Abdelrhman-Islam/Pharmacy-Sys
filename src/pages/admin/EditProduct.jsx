import React, { useState, useEffect } from "react";
import { useLocation, useNavigate  } from "react-router-dom";
import { BASE_URL } from "../../api/config";
import "../../layouts/Forms.css";
import { toast } from "react-toastify";

const EditProduct = () => {
  const location = useLocation();
  const product = location.state?.product;
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product_id: "",
    category_id: "",
    name: "",
    description: "",
    price: "",
    qty: "",
    pic: null,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (product) {
      setForm({
        product_id: product.id,
        category_id: product.category_id,
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        qty: product.qty || "",
        pic: null,
      });
    }
  }, [product]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const data = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key] !== null && form[key] !== "") {
        data.append(key, form[key]);
      }
    });

    try {
      const res = await fetch(
        `${BASE_URL}api/admin/products/update_product.php`,
        {
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const result = await res.json();

      if (result.status === "success") {
        toast.success(" Product updated successfully");
        setTimeout(() => {
          navigate("/admin/products");
        }, 500);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  if (!product) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h3>No product data found</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
          Edit Product
        </h2>

        {msg && (
          <div className="general-error-box">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label className="form-label">Name</label>
            <input
              className="form-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Product name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Price</label>
            <input
              className="form-input"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              className="form-input"
              name="qty"
              value={form.qty}
              onChange={handleChange}
              placeholder="Qty"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Description"
            />
          </div>

          <div className="form-group">
            <label className="file-upload-label">
              Upload Image
              <input
                type="file"
                name="pic"
                style={{ display: "none" }}
                onChange={(e) =>
                  setForm({ ...form, pic: e.target.files[0] })
                }
              />
            </label>
          </div>

          <button
            className="btn-form-submit"
            disabled={loading}
            type="submit"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default EditProduct;