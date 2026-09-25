import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page-container">
      <div className="empty-state">
        <h2>404</h2>

        <p style={{ marginBottom: "24px" }}>
          Sorry, the page you're looking for doesn't exist.
        </p>

        <Link to="/" className="btn btn-primary">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;