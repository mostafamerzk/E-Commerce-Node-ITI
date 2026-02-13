# API Contract

> **Note**: All API responses follow a standard format:
>
> - **Success**: `{ message: "...", data: { ... } }`
> - **Error**: `{ message: "...", stack: "..." (dev only) }`

---

## 👤 Mostafa (Product + Category + Payment)

### Category

#### 1. Create Category

- **Endpoint**: `POST /category`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "name": "Electronics", // Required, min: 2, max: 50
    "parentCategoryId": "64b..." // Optional (ObjectId)
    // Image uploaded via multipart/form-data ("image")
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Category created successfully",
    "category": {
      "_id": "64b...",
      "name": "Electronics",
      "slug": "electronics",
      "image": { "secure_url": "...", "public_id": "..." },
      "createdBy": "64a...",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  }
  ```

#### 2. Update Category

- **Endpoint**: `PATCH /category/:categoryId`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "name": "Home Electronics" // Optional, min: 2, max: 50
    // Image uploaded via multipart/form-data ("image")
  }
  ```

---

### Product

#### 1. Create Product

- **Endpoint**: `POST /product`
- **Auth**: Seller, Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "title": "iPhone 14 Pro", // Required, min: 2, max: 200
    "description": "Latest Apple iPhone...", // Optional, max: 2000
    "price": 999, // Required, min: 0
    "discount": 10, // Optional, min: 0, max: 100 (%)
    "stock": 50, // Required, min: 0
    "categoryId": "64b..." // Required (ObjectId)
    // "mainImage": (File) Required
    // "subImages": (Files) Optional (max 5)
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Product created successfully",
    "product": {
      "_id": "64c...",
      "title": "iPhone 14 Pro",
      "slug": "iphone-14-pro",
      "finalPrice": 899.1,
      "avgRating": 0,
      "mainImage": { ... },
      "images": [ ... ],
      "sellerId": "64a...",
      "categoryId": "64b..."
    }
  }
  ```

#### 2. Update Product

- **Endpoint**: `PATCH /product/:productId`
- **Auth**: Owner (Seller), Admin
- **Request Body**:
  ```json
  {
    "title": "iPhone 14 Pro Max",
    "stock": 45,
    "price": 1099,
    "discount": 5
  }
  ```

---

### Payment

#### 1. Create Payment Intent

- **Endpoint**: `POST /order/payment/create-intent`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "orderId": "64d..." // Required (ObjectId)
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "clientSecret": "pi_1234567890_secret_..."
  }
  ```

---

## 👤 Fathi (Cart + Checkout + Order)

### Cart

#### 1. Add to Cart

- **Endpoint**: `POST /cart`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "productId": "64c...", // Required (ObjectId)
    "quantity": 2 // Optional, default: 1, min: 1
  }
  ```
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Product added to cart",
    "cart": {
      "products": [{ "productId": "64c...", "quantity": 2, "price": 999 }],
      "totalPrice": 1998
    }
  }
  ```

#### 2. Update Cart Item Quantity

- **Endpoint**: `PATCH /cart/:productId` (Note: Pass productId in params, not body)
- **Auth**: User
- **Request Body**:
  ```json
  {
    "quantity": 5 // Required, min: 1
    // OR "operator": "+" / "-" if implementing increment logic
  }
  ```

---

### Order

#### 1. Place Order

- **Endpoint**: `POST /order`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "paymentMethod": "card", // Required (enum: "card", "cash", "paypal", "wallet")
    "shippingAddress": {
      "street": "123 Main St", // Required
      "city": "Cairo", // Required
      "country": "Egypt", // Required
      "postalCode": "11511", // Optional
      "phone": "+201234567890" // Required
    },
    "couponCode": "SUMMER50" // Optional
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Order placed successfully",
    "order": {
      "_id": "64e...",
      "orderNumber": "ORD-12345-XYZ",
      "userId": "64a...",
      "products": [
        {
          "productId": "64c...",
          "quantity": 1,
          "unitPrice": 999,
          "title": "iPhone 14"
        }
      ],
      "totalPrice": 1050, // Includes shipping/tax/discount
      "paymentMethod": "card",
      "paymentStatus": "unpaid",
      "orderStatus": "pending"
    }
  }
  ```

#### 2. Cancel Order

- **Endpoint**: `PATCH /order/:orderId/cancel`
- **Auth**: Owner (if pending/confirmed)
- **Request Body**: `{}` (Empty)

---

## 👤 Mokhtar (Wishlist + Reviews)

### Wishlist

#### 1. Add to Wishlist

- **Endpoint**: `POST /user/wishlist/:productId`
- **Auth**: User
- **Request Body**: `{}` (Empty, productId in params)
- **Success Response**: `200 OK` (Returns updated User doc with wishlist)

#### 2. Remove from Wishlist

- **Endpoint**: `DELETE /user/wishlist/:productId`
- **Auth**: User
- **Request Body**: `{}` (Empty)

---

### Reviews

#### 1. Add Review

- **Endpoint**: `POST /review/:productId`
- **Auth**: User (Must have purchased product - optional check)
- **Request Body**:
  ```json
  {
    "rating": 5, // Required, min: 1, max: 5
    "comment": "Great product!" // Optional, max: 1000 chars
  }
  ```
- **Success Response**: `201 Created`
  ```json
  {
    "message": "Review added successfully",
    "review": {
      "_id": "64f...",
      "userId": "64a...",
      "productId": "64c...",
      "rating": 5,
      "comment": "Great product!"
    }
  }
  ```

#### 2. Update Review

- **Endpoint**: `PATCH /review/:reviewId`
- **Auth**: Owner
- **Request Body**:
  ```json
  {
    "rating": 4, // Optional
    "comment": "Good, but expensive." // Optional
  }
  ```

---

## 👤 Issac (Admin + Seller)

### Admin

#### 1. Manage Users

- **Endpoint**: `PATCH /admin/users/:userId/restrict`
- **Auth**: Admin
- **Request Body**: `{}` (Empty)

#### 2. Manage Orders

- **Endpoint**: `PATCH /admin/orders/:orderId`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "orderStatus": "shipped" // Enum: "pending", "confirmed", "shipped", "delivered", "cancelled"
  }
  ```

#### 3. Banners

- **Endpoint**: `POST /admin/banners`
- **Auth**: Admin
- **Request Body (multipart)**:
  ```json
  {
    "title": "Summer Sale", // Required, max: 100
    "link": "/category/summer-sale", // Optional
    "isActive": true
    // "image": (File) Required
  }
  ```

### Seller

#### 1. Seller Profile

- **Endpoint**: `PATCH /seller/profile` (Assuming fields added to User model)
- **Auth**: Seller
- **Request Body**:
  ```json
  {
    "storeName": "Tech Hub",
    "phone": "+201000000000"
  }
  ```
