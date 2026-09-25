import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, API_URL } from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await api.get("/api/products");

        const productList = Array.isArray(data)
          ? data
          : data?.products || [];

        setProducts(productList.slice(0, 4));
      } catch (error) {
        console.error("Home products error:", error);
      }
    }

    loadProducts();
  }, []);

  function getImageUrl(imageUrl) {
    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return API_URL + imageUrl;
  }

  return (
    <>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-label">
              Premium Men's Fashion
            </span>

            <h1>
              Style That
              <br />
              Defines You.
            </h1>

            <p>
              Discover premium men's wear designed for modern style,
              confidence, and everyday comfort.
            </p>

            <Link to="/shop" className="btn btn-primary">
              Shop Collection
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div>
              <h2>Featured Men's Wear</h2>
              <p>Everything you need for a sharp wardrobe.</p>
            </div>

            <Link to="/shop" className="btn btn-secondary">
              View All
            </Link>
          </div>

          <div className="product-grid">
            {products.map((product) => {
              const imageUrl = getImageUrl(product.image_url);

              return (
                <Link
                  to={"/product/" + product.id}
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
                    <div className="product-image">
                      No Image
                    </div>
                  )}

                  <div className="product-info">
                    <h3>{product.name}</h3>

                    <p className="product-price">
                      ₹
                      {Number(
                        product.discount_price || product.price || 0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;