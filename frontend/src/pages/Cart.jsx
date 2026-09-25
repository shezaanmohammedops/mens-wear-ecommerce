import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { API_URL } from "../services/api";

function Cart() {
  const navigate = useNavigate();

  const {
    cartItems,
    cartCount,
    cartTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) {
      return null;
    }

    if (imageUrl.startsWith("http")) {
      return imageUrl;
    }

    return `${API_URL}${imageUrl}`;
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <main className="page-container">
        <div className="section-header">
          <div>
            <h2>Your Cart</h2>
            <p>Review your selected products.</p>
          </div>
        </div>

        <div className="empty-state">
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart and they will appear here.</p>

          <div style={{ marginTop: "24px" }}>
            <Link to="/shop" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="section-header">
        <div>
          <h2>Your Cart</h2>
          <p>
            {cartCount} {cartCount === 1 ? "item" : "items"} in your cart.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-list">
        {cartItems.map((item) => {
          const imageUrl = getImageUrl(item.image_url);

          const itemTotal =
            Number(item.price || 0) * item.quantity;

          return (
            <div className="cart-item" key={item.id}>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={item.name}
                  className="cart-item-image"
                />
              ) : (
                <div className="cart-item-image" />
              )}

              <div className="cart-item-info">
                <h3>{item.name}</h3>

                <p className="cart-item-price">
                  ₹
                  {Number(item.price || 0).toLocaleString("en-IN")}
                </p>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "12px",
                  }}
                >
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <strong>{item.quantity}</strong>

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                      updateQuantity(item.id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    marginBottom: "12px",
                  }}
                >
                  ₹{itemTotal.toLocaleString("en-IN")}
                </p>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: "30px",
          padding: "24px",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        <p
          style={{
            marginBottom: "8px",
            color: "#6b7280",
          }}
        >
          Total
        </p>

        <h2 style={{ marginBottom: "20px" }}>
          ₹{cartTotal.toLocaleString("en-IN")}
        </h2>

        <button
          type="button"
          className="btn btn-primary"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </main>
  );
}

export default Cart;
