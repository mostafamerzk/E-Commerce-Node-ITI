# Admin Module Documentation

The Admin Module provides essential administrative functionalities to manage users, products, orders, and promotional banners. This module is restricted to users with the `admin` role.

---

## **Overview**

- **Base URL**: `/admin`
- **Authentication**: Required (`Bearer Token`)
- **Authorization**: `Admin` role only

---

## **1. User Management**

### **Get All Users**

Retrieves a paginated list of all users.

- **Endpoint**: `GET /admin/users`
- **Query Params**:
  - `page` (number, optional, min: 1): Page number.
  - `limit` (number, optional, default: 10, max: 30): Items per page.
- **Success Response**: `200 OK`
  ```json
  {
    "message": "all users",
    "data": {
      "docs": [...],
      "total": 50,
      "pages": 5,
      "page": 1
    }
  }
  ```

### **Get User By ID**

Retrieves detailed information about a specific user.

- **Endpoint**: `GET /admin/users/:id`
- **Path Params**:
  - `id` (string): MongoDB User ObjectId.
- **Success Response**: `200 OK`
  ```json
  {
    "message": "user found",
    "data": { ... }
  }
  ```

### **Restrict User (Soft Delete)**

Disables a user's account by setting `isDeleted: true`.

- **Endpoint**: `PATCH /admin/users/:id/restrict`
- **Path Params**:
  - `id` (string): MongoDB User ObjectId.
- **Success Response**: `200 OK`
  ```json
  {
    "message": "user restricted",
    "data": { ... }
  }
  ```

### **Approve User (Restore Account)**

Re-enables a restricted user's account.

- **Endpoint**: `PATCH /admin/users/:id/approve`
- **Path Params**:
  - `id` (string): MongoDB User ObjectId.
- **Success Response**: `200 OK`
  ```json
  {
    "message": "user approved",
    "data": { ... }
  }
  ```

---

## **2. Product Management**

### **Get All Products**

Retrieves a paginated and filtered list of all products.

- **Endpoint**: `GET /admin/products`
- **Query Params**:
  - `page`, `limit` (number, optional)
  - `sort` (string, optional): `newest`, `oldest`, `priceHigh`, `priceLow`, `rating`.
  - `minPrice`, `maxPrice` (number, optional)
  - `rating` (number, optional): 1-5.
  - `search` (string, optional): Search by product name.
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Products fetched successfully",
    "products": { ... }
  }
  ```

### **Delete Product (Soft Delete)**

Marks a product as deleted.

- **Endpoint**: `DELETE /admin/products/:id`
- **Success Response**: `200 OK`
  ```json
  {
    "success": true,
    "message": "product deleted",
    "data": { ... }
  }
  ```

---

## **3. Order Management**

### **Get All Orders**

Retrieves a list of all orders with advanced filtering options.

- **Endpoint**: `GET /admin/orders`
- **Query Params**:
  - `page`, `limit`, `sort` (optional)
  - `orderStatus` (string, optional): `pending`, `confirmed`, `shipped`, etc.
  - `userId` (string, optional)
  - `paymentStatus` (string, optional)
- **Success Response**: `200 OK`
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": { ... }
  }
  ```

### **Update Order Status**

Updates the status of an order. Only valid state transitions are allowed.

- **Endpoint**: `PATCH /admin/orders/:id/status`
- **Request Body**:
  ```json
  {
    "orderStatus": "shipped"
  }
  ```
- **Valid Transitions**:
  - `pending` -> `confirmed`, `cancelled`
  - `confirmed` -> `processing`, `cancelled`
  - `processing` -> `shipped`, `cancelled`
  - `shipped` -> `delivered`, `returned`
- **Success Response**: `200 OK`

---

## **4. Banner Management**

### **Create Banner**

Creates a new promotional banner with an image.

- **Endpoint**: `POST /admin/banners`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `title` (string, required)
  - `link` (string, required)
  - `image` (file, required)
- **Success Response**: `201 Created`

### **Update Banner**

Updates an existing banner (title, link, active status, or image).

- **Endpoint**: `PATCH /admin/banners/:id`
- **Request Body**: (all fields optional)
  - `title`, `link`, `isActive`, `image`
- **Success Response**: `200 OK`
