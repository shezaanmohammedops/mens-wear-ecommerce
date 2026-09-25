import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();

  const navClass = ({ isActive }) =>
    isActive ? "active" : "";

  return (
    <header className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">
          MEN'S WEAR
        </Link>

        <nav className="nav-links">
          <NavLink to="/" className={navClass}>
            Home
          </NavLink>

          <NavLink to="/shop" className={navClass}>
            Shop
          </NavLink>

          <NavLink to="/cart" className={navClass}>
            Cart ({cartCount})
          </NavLink>

          {isAuthenticated ? (
            <>
              <span style={{ fontWeight: 600 }}>
                Hi, {user?.name || user?.email || "User"}
              </span>

              <button
                type="button"
                onClick={logout}
                style={{
                  border: "none",
                  background: "transparent",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={navClass}>
              Login
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;