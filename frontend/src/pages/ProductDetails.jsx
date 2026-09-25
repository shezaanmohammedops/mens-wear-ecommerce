import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, API_URL } from "../services/api";
import { useCart } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await api.get("/api/products/" + id);

        console.log("PRODUCT DATA:", data);

        setProduct(data);
      } catch (err) {
        console.error("PRODUCT ERROR:", err);
        setError(err.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Loading product...</h2>
          <p>Please wait.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Product not found</h2>
          <p>{error}</p>

          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Product not found</h2>

          <Link to="/shop" className="btn btn-primary">
            Back to Shop
          </Link>
        </div>
      </main>
    );
  }

  let imageUrl = null;

  if (product.image_url) {
    if (product.image_url.startsWith("http")) {
      imageUrl = product.image_url;
    } else {
      imageUrl = API_URL + product.image_url;
    }
  }

  function handleAddToCart() {
    addToCart(product, 1);
  }

  return (
    <main className="page-container">
      <div className="product-details">
        <div>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="product-details-image"
            />
          ) : (
            <div className="product-details-image">
              No Image
            </div>
          )}
        </div>

        <div className="product-details-info">
          <h1>{product.name}</h1>

          <h2>
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </h2>

          {product.discount_price ? (
            <p>
              Discount Price: ₹
              {Number(product.discount_price).toLocaleString("en-IN")}
            </p>
          ) : null}

          {product.description ? (
            <p className="product-details-description">
              {product.description}
            </p>
          ) : null}

          <p>
            <strong>Brand:</strong> {product.brand || "N/A"}
          </p>

          <p>
            <strong>Size:</strong> {product.size || "N/A"}
          </p>

          <p>
            <strong>Color:</strong> {product.color || "N/A"}
          </p>

          <p>
            <strong>Stock:</strong> {product.stock_quantity || 0}
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAddToCart}
            disabled={!product.stock_quantity}
          >
            Add to Cart
          </button>

          <div style={{ marginTop: "16px" }}>
            <Link to="/cart" className="btn btn-secondary">
              View Cart
            </Link>
          </div>

          <div style={{ marginTop: "16px" }}>
            <Link to="/shop" className="btn btn-secondary">
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;