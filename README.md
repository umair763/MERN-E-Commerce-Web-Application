# StyleHive - E-Commerce Web Application

A full-stack fashion & lifestyle e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js). StyleHive provides a complete shopping experience with role-based access control for customers, administrators, and super administrators.

## 🚀 Features

### Customer Features
- **Product Browsing**: Browse products organized by categories with pagination
- **Search & Filter**: Search products and filter by category
- **Shopping Cart**: Add products to cart with quantity management
- **Wishlist**: Save favorite products for later
- **Order Management**: Place orders and track order status
- **User Profile**: Manage personal information and addresses
- **Reviews**: Rate and review purchased products
- **Return Requests**: Request returns for delivered orders

### Admin Features
- **Product Management**: Create, edit, delete products with variants
- **Category Management**: Organize products into categories
- **Order Management**: View and manage customer orders
- **Coupon Management**: Create and manage discount coupons
- **Return Management**: Process return requests
- **User Management**: View and manage customer accounts
- **Review Management**: Moderate customer reviews

### Super Admin Features
- All Admin features plus:
- **Role Management**: Manage user roles and permissions
- **Audit Logs**: Track system activities
- **System Settings**: Configure global application settings
- **User Management**: Full control over all user accounts

## 🛠 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **React Router DOM** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Framer Motion** - Animation library
- **React Toastify** - Toast notifications
- **Axios** - HTTP client (for API calls)

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **Cloudinary** - Cloud image storage
- **Zod** - Schema validation
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/umair763/MERN-E-Commerce-Web-Application.git
cd MERN-E-Commerce-Web-Application
```

### Backend Setup
1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

4. Run the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the client directory:
```env
VITE_API_URL=http://localhost:5000
```

4. Run the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🌐 Database Seeding

To populate the database with sample data for testing:

1. Ensure the backend server is running
2. Run the seed script:
```bash
cd server
node seed.js
```

This will create:
- Admin and Super Admin users
- Customer user account
- 7 categories with 15 products each (105 total products)
- Sample orders, coupons, returns, reviews, and addresses
- System settings and audit logs

**Default Credentials:**
- Admin: `admin@stylehive.local` / `admin@123!`
- Super Admin: `superadmin@stylehive.local` / `superadmin@123!`
- Customer: `umair@stylehive.local` / `customer@123!`

## 📁 Project Structure

```
StyleHive/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context providers
│   │   ├── layout/        # Layout components (Navbar, Footer, etc.)
│   │   ├── modules/       # Feature modules (admin, super-admin, etc.)
│   │   ├── pages/         # Page components
│   │   ├── router.route.jsx  # Route configuration
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Express application
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── seed.js           # Database seeding script
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin/Super Admin)
- `PUT /api/products/:id` - Update product (Admin/Super Admin)
- `DELETE /api/products/:id` - Delete product (Admin/Super Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin/Super Admin)
- `PUT /api/categories/:id` - Update category (Admin/Super Admin)
- `DELETE /api/categories/:id` - Delete category (Admin/Super Admin)

### Orders
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `POST /api/orders` - Create order
- `PUT /api/orders/:id` - Update order status (Admin/Super Admin)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist/:productId` - Add to wishlist
- `DELETE /api/wishlist/:productId` - Remove from wishlist

## 🎨 User Roles

### Customer
- Browse and search products
- Add items to cart and wishlist
- Place orders and track status
- Write reviews for purchased products
- Request returns for delivered orders
- Manage profile and addresses

### Admin
- All customer features plus:
- Manage products and categories
- Process orders and returns
- Create and manage coupons
- View customer reviews
- Manage customer accounts

### Super Admin.
- All admin features plus:
- Manage user roles and permissions
- Configure system settings
- View audit logs
- Full control over all users and data

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Rate limiting on API endpoints
- Security headers with Helmet
- Input validation with Zod
- CORS configuration
- Protected routes for admin/super admin

## 📝 License

This project is licensed under the ISC License.

## 👤 Author

**Umair**

## Acknowledgments

- Built with MERN stack
- Icons by Lucide React
- Styled with TailwindCSS

