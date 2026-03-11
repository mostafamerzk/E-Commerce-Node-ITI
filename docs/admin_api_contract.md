# Admin API Contract

This document outlines all admin-level APIs in the E-Commerce system, including their endpoints, authorization requirements, and validation schema hints.

---

## **1. Admin Module**

**Base URL**: `/admin`

### **Analytics & Dashboard**

- **GET `/admin/analytics`**
  - **Description**: Retrieves aggregated data for the admin dashboard (counts, revenue, top products, etc.).
  - **Auth**: `Admin`
  - **Validation (Query)**:
    - `startDate`: ISO Date (Optional)
    - `endDate`: ISO Date (Optional)
  - **Success Response**: `200 OK`
    ```json
    {
      "message": "Analytics fetched successfully",
      "data": {
        "counts": { "totalUsers": 100, "totalSellers": 20, "totalProducts": 50, "totalOrders": 200 },
        "revenue": { "totalRevenue": [...], "byDay": [...], "byMonth": [...] },
        "topProducts": [...],
        "lowStock": [...],
        "ordersByStatus": [...]
      }
    }
    ```

### **User Management**

- **GET `/admin/users`**
  - **Description**: List all users with filtering and pagination.
  - **Auth**: `Admin`
  - **Validation (Query)**:
    - `page`: Number (Optional, Min: 1)
    - `limit`: Number (Optional, Min: 1, Max: 30)
    - `search`: String (Optional, Username/Email)
    - `role`: String (Optional, `user`, `admin`, `seller`)
    - `isBlocked`: Boolean (Optional)

- **GET `/admin/users/:id`**
  - **Description**: Get details of a specific user.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/users/:id/restrict`**
  - **Description**: Restrict/Soft-delete a user.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/users/:id/approve`**
  - **Description**: Approve/Restore a restricted user.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/users/:id/role`**
  - **Description**: Update a user's role.
  - **Auth**: `Admin`
  - **Validation**:
    - `id`: ObjectId (Params, **Required**)
    - `role`: String (Body, **Required**, `user`, `admin`, `seller`)

### **Seller Management**

- **GET `/admin/sellers`**
  - **Description**: List all sellers.
  - **Auth**: `Admin`
  - **Validation**: Same as `GET /admin/users`.

- **GET `/admin/sellers/:id`**
  - **Description**: Get seller details and their products.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/sellers/:id/approve`**
  - **Description**: Approve a seller (sets `isBlocked: false`).
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/sellers/:id/restrict`**
  - **Description**: Restrict a seller (sets `isBlocked: true`).
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

### **Product Management (Admin Extras)**

- **GET `/admin/products`**
  - **Description**: List all products with advanced admin filters.
  - **Auth**: `Admin`
  - **Validation (Query)**:
    - `page`: Number (Optional, Min: 1)
    - `limit`: Number (Optional, Min: 1)
    - `sort`: `newest`, `oldest`, `priceHigh`, `priceLow`, `rating` (Optional)
    - `minPrice`, `maxPrice`: Number (Optional)
    - `rating`: 1-5 (Optional)
    - `inStock`: `true`/`false` (Optional)
    - `category`: ObjectId (Optional)

- **GET `/admin/products/:id`**
  - **Description**: Get specific product details (Admin view).
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **DELETE `/admin/products/:id`**
  - **Description**: Delete a product.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

- **PATCH `/admin/products/:id/recover`**
  - **Description**: Recover a deleted product.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `id`: ObjectId (**Required**)

### **Order Management**

- **GET `/admin/orders`**
  - **Description**: List all orders with filters.
  - **Auth**: `Admin`
  - **Validation (Query)**:
    - `page`: Number (Optional, Min: 1)
    - `limit`: Number (Optional, Min: 1, Max: 30)
    - `sort`: String (Optional)
    - `orderStatus`: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned` (Optional)
    - `userId`: ObjectId (Optional)
    - `paymentStatus`: `unpaid`, `paid`, `refunded` (Optional)
    - `minTotal`, `maxTotal`: Number (Optional)
    - `startDate`, `endDate`: Date (Optional)

- **PATCH `/admin/orders/:id/status`**
  - **Description**: Update order shipping/delivery status.
  - **Auth**: `Admin`
  - **Validation**:
    - `id`: ObjectId (Params, **Required**)
    - `orderStatus`: String (Body, **Required**)

### **Coupon Management**

- **POST `/admin/coupons`**
  - **Description**: Create a new discount coupon.
  - **Auth**: `Admin`
  - **Validation (Body)**:
    - `code`: String (**Required**)
    - `discountType`: `percentage` | `fixed` (**Required**)
    - `discountValue`: Number (**Required**)
    - `minOrderAmount`: Number (Optional)
    - `maxUses`: Number (Optional)
    - `expiresAt`: Date (Optional)

- **GET `/admin/coupons`**
  - **Description**: List all coupons.
  - **Auth**: `Admin`

- **PATCH `/admin/coupons/:id`**
  - **Description**: Update coupon details.
  - **Auth**: `Admin`
  - **Validation**:
    - `id`: ObjectId (Params, **Required**)
    - `discountType`, `discountValue`, `minOrderAmount`, `maxUses`, `expiresAt`: (Body, Optional)
    - `isActive`: Boolean (Body, Optional)

### **Banner Management**

- **POST `/admin/banners`**
  - **Description**: Create a promotional banner.
  - **Auth**: `Admin`
  - **Validation (Body/Form-Data)**:
    - `title`: String (**Required**)
    - `link`: String (**Required**)
    - `image`: File (**Required**) (Note: Validated as `file` internally)

- **PATCH `/admin/banners/:id`**
  - **Description**: Update banner.
  - **Auth**: `Admin`
  - **Validation**:
    - `id`: ObjectId (Params, **Required**)
    - `title`, `link`, `image`: (Body, Optional) (Note: `image` validated as `file` internally)
    - `isActive`: Boolean (Optional)

---

## **2. Category Module**

**Base URL**: `/category`

- **POST `/category/`**
  - **Description**: Create a new category.
  - **Auth**: `Admin`
  - **Validation (Body/Form-Data)**:
    - `name`: String (**Required**)
    - `parentCategoryId`: ObjectId (Optional)
    - `image`: File (**Required**) (Note: Validated as `file` internally)

- **PATCH `/category/:categoryId`**
  - **Description**: Update category.
  - **Auth**: `Admin`
  - **Validation**:
    - `categoryId`: ObjectId (Params, **Required**)
    - `name`, `parentCategoryId`, `image`: (Body, Optional) (Note: `image` validated as `file` internally)

- **DELETE `/category/:categoryId`**
  - **Description**: Delete a category.
  - **Auth**: `Admin`
  - **Validation (Params)**:
    - `categoryId`: ObjectId (**Required**)

---

## **3. Product Module**

**Base URL**: `/product`

- **POST `/product/`**
  - **Description**: Create a new product.
  - **Auth**: `Admin` | `Seller`
  - **Validation (Body/Form-Data)**:
    - `title`, `price`, `stock`, `categoryId`: (**Required**)
    - `description`: String (Optional)
    - `discount`: Number (Optional)
    - `mainImage`: File (**Required**)
    - `subImages`: Files (Optional, Max: 5)

- **DELETE `/product/:productId`**
  - **Description**: Delete a product (Admin can delete any, Seller only their own).
  - **Auth**: `Admin` | `Seller`
  - **Validation (Params)**:
    - `productId`: ObjectId (**Required**)

---

## **4. Review Module**

**Base URL**: `/review`

- **DELETE `/review/:reviewId`**
  - **Description**: Delete/Moderate a review.
  - **Auth**: `Admin` | `Seller` (of product) | `User` (author)
  - **Validation (Params)**:
    - `reviewId`: ObjectId (**Required**)

---

## **5. User/Profile Module (Admin Access)**

**Base URL**: `/user`

- **GET `/user/profile`**
  - **Description**: Get own profile (Admin role).
  - **Auth**: `Admin` | `User`

- **DELETE `/user/profile/freeze`**
  - **Description**: Freeze account.
  - **Auth**: `Admin` | `User`
