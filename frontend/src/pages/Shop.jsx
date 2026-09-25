import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_URL } from "../services/api";

function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await api.get("/api/products");

        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        setProducts(productList);
      } catch (err) {
        setError(err.message || "Unable to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };

  if (loading) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Loading products...</h2>
          <p>Please wait.</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="section-header">
        <div>
          <h2>Shop Men's Wear</h2>
          <p>Discover our latest collection.</p>
        </div>

        <p>
          {products.length}{" "}
          {products.length === 1 ? "Product" : "Products"}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <h2>No products available</h2>
          <p>Products will appear here once they are added.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => {
            const imageUrl = getImageUrl(product.image_url);

            return (
              <Link
                to={`/product/${product.id}`}
                className="product-card"
                key={product.id}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="product-image"
                  />
                ) : (
                  <div className="product-image" />
                )}

                <div className="product-info">
                  <h3>{product.name}</h3>

                  {product.category && (
                    <p>{product.category}</p>
                  )}

                  <p className="product-price">
                    ₹
                    {Number(product.price || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Shop;