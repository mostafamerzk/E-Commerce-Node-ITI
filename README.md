# E-Commerce API

A comprehensive E-Commerce RESTful API built with Node.js and Express.js, utilizing MongoDB Atlas for scalable and secure data storage. This project features a full-featured online store backend, including user authentication, product management, shopping cart, order processing, and seller management.

## Key Features

### Authentication and Authorization

- Robust Authentication: JWT-based authentication with Access and Refresh tokens.
- Google OAuth: Integration with Google for simplified user registration and login.
- Role-Based Access Control (RBAC): Secure endpoints with granular permissions for User, Seller, and Admin roles.

### User Management

- Profile Management: Comprehensive profile updates, including profile and cover image uploads to Cloudinary.
- Account Security: Password reset and change flows using OTP (One-Time Password) via email.
- Account Lifecycle: Email verification for account activation, account freezing (soft-delete), and reactivation flows.

### Seller and Marketplace

- Seller Profiles: Special account type for vendors to manage their own store information.
- Store Management: Dedicated store dashboard including store name, description, and branding.
- Inventory Control: Interface for sellers to manage their own product listings, stock levels, and historical inventory.

### Product Catalog

- Advanced Management: Complete CRUD operations for products, categories, and sub-categories.
- Discovery: Powerful search by keyword, advanced filtering (price ranges, categories), and specialized sorting.
- Presentation: Dynamic pagination for large catalogs and optimized image galleries powered by Cloudinary.

### Purchase Flow

- Shopping Cart: Persistent cart management with real-time stock validation and price calculations.
- Checkout System: Detailed order summaries with price breakdowns including subtotal, shipping, and taxes.
- Payment Integration: Full integration with Stripe including secure Checkout Sessions and asynchronous Webhook handling for payment confirmation.

### Order Processing

- Lifecycle Tracking: Complete order state management (Pending, Processing, Shipped, Delivered, Cancelled).
- Stock Integrity: Automatic stock deduction upon purchase and restoration upon cancellation.
- Communications: Automated email notifications for order placement and status updates.

### Community and Feedback

- Reviews and Ratings: Multi-dimensional review system allowing one review per user per product.
- Dynamic Metrics: Automatic calculation of average ratings and review counts on the product level.

### Admin and Content Management

- User Oversight: Administrative tools to list, search, restrict, or re-approve users.
- Content Management: CRUD operations for homepage banners and promotional content.
- Global Management: Full visibility into all products and orders across the system.

## Technology Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB Atlas
- ODM: Mongoose
- Validation: Joi
- File Uploads: Multer and Cloudinary
- Payment Gateway: Stripe
- Email Service: Nodemailer

## Project Structure

```text
src/
├── DB/                 # Database connection and Mongoose Models
├── middleware/         # Auth, validation, and error handling middleware
├── modules/            # Feature modules (User, Auth, Product, Cart, Seller, Payment...)
│   └── User/           # Example module structure
│       ├── user.controller.js
│       ├── user.service.js
│       └── user.validation.js
└── utils/              # Helper utilities (Email, Hashing, Tokens, Stripe...)
```

## Installation and Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/mostafamerzk/E-Commerce-Node-ITI.git
   cd E-Commerce-Node-ITI
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Environment Configuration:
   Create a .env file in the root directory and configure the variables as shown in the .env.example (ensure you include STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET).

4. Run the application:

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## Deployment

The application is configured for deployment on Vercel. Database hosting is handled by MongoDB Atlas, and media assets are stored on Cloudinary.

## Authors

Built by the ITI Node.js E-Commerce Team:

- Mostafa: Product Management, Categories, and Payment Integration
- Fathi: Shopping Cart, Checkout, and Order Management
- Mokhtar: Wishlist and Seller Management
- Issac: Admin Dashboard and Reviews System

### Supervisor

Dr. Mariam Abdelhady
