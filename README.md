# Men's Wear E-Commerce

A full-stack men's clothing e-commerce web application built with React, Python, FastAPI, REST APIs, and MySQL.

The project provides a complete shopping workflow including user authentication, product browsing, product details, cart management, checkout, orders, payments, and admin functionality.

---

## 🚀 Features

### User Features

- User registration and login
- JWT-based authentication
- User authentication state management
- Browse products
- Browse products by category
- View product details
- Add products to cart
- Update cart items
- Remove items from cart
- Checkout
- Place orders
- Order management

### Admin Features

- Admin authentication
- Product management
- Category management
- User management
- Order management
- Payment management

### Backend Features

- RESTful API architecture
- FastAPI backend
- MySQL database integration
- SQLAlchemy models
- JWT authentication
- Password security
- Request/response schemas
- Service-layer architecture
- Product image upload support
- Separate routers for application modules

### Frontend Features

- React-based user interface
- React Router navigation
- Authentication context
- Cart context
- Responsive layout
- Product listing
- Product details
- Login and registration
- Shopping cart
- Checkout
- 404 page

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- HTML
- CSS
- React Router
- Axios

### Backend

- Python
- FastAPI
- REST API
- SQLAlchemy
- JWT Authentication

### Database

- MySQL

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Vite

---

## 📁 Project Structure

```text
mens-wear-ecommerce/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── dependencies.py
│   │   │   ├── jwt.py
│   │   │   └── password.py
│   │   │
│   │   ├── models/
│   │   │   ├── cart.py
│   │   │   ├── category.py
│   │   │   ├── order.py
│   │   │   ├── payment.py
│   │   │   ├── product.py
│   │   │   └── user.py
│   │   │
│   │   ├── routers/
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── cart.py
│   │   │   ├── categories.py
│   │   │   ├── orders.py
│   │   │   ├── payments.py
│   │   │   ├── products.py
│   │   │   └── users.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── cart.py
│   │   │   ├── category.py
│   │   │   ├── order.py
│   │   │   ├── payment.py
│   │   │   ├── product.py
│   │   │   └── user.py
│   │   │
│   │   ├── services/
│   │   │   ├── admin_service.py
│   │   │   ├── auth_service.py
│   │   │   ├── cart_service.py
│   │   │   ├── order_service.py
│   │   │   ├── payment_service.py
│   │   │   └── product_service.py
│   │   │
│   │   ├── utils/
│   │   │   └── security.py
│   │   │
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx
│   │   ├── pages/
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Shop.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   └── package.json
│
└── README.md