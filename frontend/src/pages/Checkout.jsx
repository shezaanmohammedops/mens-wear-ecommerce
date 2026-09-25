import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api";

function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [pinCode, setPinCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const token = localStorage.getItem("menswear_token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !fullName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim() ||
      !pinCode.trim()
    ) {
      setError("Please fill all shipping details.");
      return;
    }

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    const shippingAddress =
      fullName.trim() +
      ", " +
      phone.trim() +
      ", " +
      address.trim() +
      ", " +
      city.trim() +
      ", PIN: " +
      pinCode.trim();

    try {
      setLoading(true);

      const response = await api.post("/api/orders", {
        shipping_address: shippingAddress,
      });

      setOrder(response);
      clearCart();
    } catch (err) {
      setError(
        err.message || "Failed to place order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (order) {
    return (
      <main className="page-container">
        <div
          style={{
            maxWidth: "600px",
            margin: "50px auto",
            padding: "40px",
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            textAlign: "center",
          }}
        >
          <h2>Order Placed Successfully!</h2>

          <p style={{ marginTop: "15px" }}>
            Thank you for your purchase.
          </p>

          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              textAlign: "left",
            }}
          >
            <p>
              <strong>Order ID:</strong> #{order.id}
            </p>

            <p style={{ marginTop: "10px" }}>
              <strong>Status:</strong> {order.status}
            </p>

            <p style={{ marginTop: "10px" }}>
              <strong>Total:</strong> ₹
              {Number(order.total_amount || 0).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <Link
            to="/shop"
            className="btn btn-primary"
            style={{
              display: "inline-block",
              marginTop: "25px",
            }}
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="page-container">
        <div className="empty-state">
          <h2>Your cart is empty</h2>

          <p>Add products to your cart before checkout.</p>

          <div style={{ marginTop: "24px" }}>
            <Link to="/shop" className="btn btn-primary">
              Continue Shopping
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
          <h2>Checkout</h2>
          <p>Complete your order details.</p>
        </div>
      </div>

      {error && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px",
            background: "#fee2e2",
            border: "1px solid #fecaca",
            color: "#b91c1c",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "30px",
            alignItems: "start",
          }}
        >
          {/* SHIPPING INFORMATION */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              padding: "24px",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>
              Shipping Information
            </h3>

            <div
              style={{
                display: "grid",
                gap: "16px",
              }}
            >
              {/* FULL NAME */}
              <div>
                <label htmlFor="fullName">
                  Full Name
                </label>

                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* PHONE */}
              <div>
                <label htmlFor="phone">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="Enter your phone number"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* ADDRESS */}
              <div>
                <label htmlFor="address">
                  Address
                </label>

                <textarea
                  id="address"
                  value={address}
                  onChange={(event) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter your complete address"
                  rows="4"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    border: "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* CITY */}
              <div>
                <label htmlFor="city">
                  City
                </label>

                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(event) =>
                    setCity(event.target.value)
                  }
                  placeholder="Enter your city"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>

              {/* PIN CODE */}
              <div>
                <label htmlFor="pinCode">
                  PIN Code
                </label>

                <input
                  id="pinCode"
                  type="text"
                  inputMode="numeric"
                  value={pinCode}
                  onChange={(event) =>
                    setPinCode(event.target.value)
                  }
                  placeholder="Enter PIN code"
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "6px",
                    border: "1px solid #d1d5db",
                  }}
                />
              </div>
            </div>
          </div>

          {/* ORDER SUMMARY */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              padding: "24px",
            }}
          >
            <h3 style={{ marginBottom: "20px" }}>
              Order Summary
            </h3>

            <div
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "15px",
                    paddingBottom: "12px",
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <div>
                    <strong>{item.name}</strong>

                    <div
                      style={{
                        marginTop: "5px",
                        color: "#6b7280",
                        fontSize: "14px",
                      }}
                    >
                      Qty: {item.quantity}
                    </div>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(item.price || 0) *
                      Number(item.quantity || 0)
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
                paddingTop: "15px",
                borderTop: "2px solid #111827",
                fontSize: "20px",
              }}
            >
              <strong>Total</strong>

              <strong>
                ₹{Number(cartTotal || 0).toLocaleString("en-IN")}
              </strong>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                marginTop: "25px",
              }}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>

            <Link
              to="/cart"
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "15px",
              }}
            >
              Back to Cart
            </Link>
          </div>
        </div>
      </form>
    </main>
  );
}

export default Checkout;