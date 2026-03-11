# Admin Module Documentation

The Admin Module provides essential administrative functionalities to manage users, sellers, products, categories, orders, coupons, reviews, and promotional banners.

---

## **Overview**

- **Base URL**: `/admin` (Most endpoints), `/categories`, `/reviews`, `/products`
- **Authentication**: Required (`Bearer Token`)
- **Authorization**: `Admin` role required (some endpoints also allow `Seller`)

---

## **1. Analytics & Dashboard**

### **Get Analytics**

Retrieves aggregated data for the admin dashboard.

- **Endpoint**: `GET /admin/analytics`
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

---

## **2. User Management**

### **Get All Users**

- **Endpoint**: `GET /admin/users`
- **Query Params**: `page`, `limit`, `search` (userName/email), `role`, `isBlocked`
- **Success Response**: `200 OK` (Standardized pagination + `docs` key)

### **Update User Role**

- **Endpoint**: `PATCH /admin/users/:id/role`
- **Body**: `{ "role": "seller" | "admin" | "user" }`

### **Restrict/Approve User**

- `PATCH /admin/users/:id/restrict`: Sets `isDeleted: true`.
- `PATCH /admin/users/:id/approve`: Sets `isDeleted: false`.

---

## **3. Seller Management**

### **List Sellers**

- **Endpoint**: `GET /admin/sellers`
- **Query Params**: `page`, `limit`, `search`, `isBlocked`

### **Get Seller Details**

- **Endpoint**: `GET /admin/sellers/:id`
- **Returns**: Seller profile + their products.

### **Approve/Restrict Seller**

- `PATCH /admin/sellers/:id/approve`: Sets `isBlocked: false`.
- `PATCH /admin/sellers/:id/restrict`: Sets `isBlocked: true`.

---

## **4. Product & Category Management**

### **Product Operations**

- `GET /admin/products`: Advanced filtering (category, search, price, stock).
- `POST /products`: Create product (Admin/Seller).
- `PATCH /products/:id`: Update product (Admin/Seller).
- `DELETE /products/:id`: Delete product (Admin/Seller).
- `PATCH /admin/products/:id/recover`: Restore deleted product.

### **Category Operations**

- `GET /categories`: List all.
- `POST /categories`: Create category (Admin only).
- `PATCH /categories/:id`: Update category (Admin only).
- `DELETE /categories/:id`: Delete category (Admin only).

---

## **5. Order Management**

### **List Orders**

- **Endpoint**: `GET /admin/orders`
- **Query Params**: `orderStatus`, `paymentStatus`, `userId`, `minTotal`, `maxTotal`, `startDate`, `endDate`.

### **Update Order Status**

- **Endpoint**: `PATCH /admin/orders/:id/status`
- **Body**: `{ "orderStatus": "shipped" }`

---

## **6. Coupon Management**

### **CRUD Operations**

- `POST /admin/coupons`: Create new coupon.
- `GET /admin/coupons`: List all coupons.
- `GET /admin/coupons/:id`: Get single coupon.
- `PATCH /admin/coupons/:id`: Update coupon.
- `DELETE /admin/coupons/:id`: Deactivate coupon (soft delete).

---

## **7. Reviews Moderation**

### **List Reviews**

- **Endpoint**: `GET /admin/reviews`
- **Query Params**: `productId`, `userId`, `rating`.

### **Delete Review**

- **Endpoint**: `DELETE /reviews/:reviewId`
- **Authorization**: Admin, Seller (of the product), or the User who wrote it.

---

## **8. Banner Management**

- `GET /admin/banners`: List all.
- `POST /admin/banners`: Create banner.
- `PATCH /admin/banners/:id`: Update banner.
- `DELETE /admin/banners/:id`: Deactivate banner.
- `PATCH /admin/banners/:id/activate`: Re-activate banner.
