# E-Commerce API 🛒

A comprehensive E-Commerce RESTful API built with **Node.js** and **Express.js**, utilizing **MongoDB Atlas** for scalable and secure data storage.

This project features a full-featured online store backend, including user authentication, product management, shopping cart, order processing, and reviews.

## 🚀 Key Features

- **Robust Authentication**: JWT-based authentication with Access & Refresh tokens.
- **Role-Based Access Control (RBAC)**: secure endpoints for User, Seller, and Admin roles.
- **User Management**: Profile updates, password reset/change with OTP, email verification, and soft deletion.
- **Product Catalog**: Advanced product management with categories, sub-categories, search, filtering, sorting, and pagination.
- **Shopping Cart**: Real-time cart management with stock validation and total price calculation.
- **Order Processing**: Complete order lifecycle (Pending → Processing → Shipped → Delivered/Cancelled).
- **Payment Integration**: Support for multiple payment methods (Credit Card, PayPal, COD, Wallet).
- **Reviews & Ratings**: User-generated reviews and dynamic product ratings.
- **Image Management**: Optimized image uploads and storage using **Cloudinary**.
- **Security**: Data encryption, hashing, and secure headers.
- **Communication**: Email notifications for registration, order updates, and password resets via **Nodemailer**.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Cloud-hosted NoSQL)
- **ODM**: Mongoose
- **Validation**: Joi
- **File Uploads**: Multer
- **Cloud Storage**: Cloudinary
- **Email Service**: Nodemailer

## 📦 Installation & Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/mostafamerzk/E-Commerce-Node-ITI.git
    cd E-Commerce-Node-ITI
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    Create a `.env` file in the root directory and configure the following variables:

    ```env
    PORT=3000
    CONNECTION_URI=<Your MongoDB Atlas Connection String>

    # 🔐 Security
    SALT_ROUND=8
    ACCESS_TOKEN_EXPIRE=1d
    REFRESH_TOKEN_EXPIRE=7d
    TOKEN_SECRET=<Your Secret Key>

    # 📧 Email Service
    EMAIL=<Your Gmail Address>
    EMAIL_PASSWORD=<Your App Password>

    # ☁️ Cloudinary
    CLOUD_NAME=<Your Cloudinary Cloud Name>
    API_KEY=<Your Cloudinary API Key>
    API_SECRET=<Your Cloudinary API Secret>

    # 🌐 Google Auth (Optional)
    WEB_CLIENT_ID=<Your Google Client ID>
    ```

4.  **Run the application:**

    ```bash
    # Development mode (with nodemon)
    npm run dev

    # Production mode
    npm start
    ```

## 📂 Project Structure

```bash
src/
├── DB/                 # Database connection & Mongoose Models
├── middleware/         # Auth, validation, and error handling middleware
├── modules/            # Feature modules (User, Auth, Product, Cart...)
│   └── User/           # Example module structure
│       ├── user.controller.js
│       ├── user.service.js
│       └── user.validation.js
└── utils/              # Helper utilities (Email, Hashing, Tokens...)
```

## 👥 Authors

Built with ❤️ by the **ITI Node.js E-Commerce Team**:

- **Mostafa**: Product Management, Categories, & Payment Integration
- **Fathi**: Shopping Cart, Checkout, & Order Management
- **Mokhtar**: Wishlist & Seller Management
- **Issac**: Admin Dashboard & Reviews System

### 🎓 Supervisor

**Dr. Mariam Abdelhady**
