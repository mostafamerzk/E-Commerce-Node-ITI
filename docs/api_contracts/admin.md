# Admin API Contract (Owner: Issac)

> **Base URL**: `/admin`

## 1. Get All Users

- **Endpoint**: `GET /users`
- **Auth**: Admin
- **Query Params**: `search`, `page`, `limit`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Users fetched successfully",
    "users": [ ... ]
  }
  ```

## 2. Restrict User

- **Endpoint**: `PATCH /users/:userId/restrict`
- **Auth**: Admin
- **Description**: Soft deletes the user or sets `isBlocked: true`.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "User restricted successfully"
  }
  ```

## 3. Approve User

- **Endpoint**: `PATCH /users/:userId/approve`
- **Auth**: Admin
- **Description**: Re-activates a user.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "User approved successfully"
  }
  ```

## 4. Get All Products

- **Endpoint**: `GET /products`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Products fetched successfully",
    "products": [ ... ]
  }
  ```

## 5. Delete Product

- **Endpoint**: `DELETE /products/:productId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

## 6. Get All Orders

- **Endpoint**: `GET /orders`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": [ ... ]
  }
  ```

## 7. Update Order Status

- **Endpoint**: `PATCH /orders/:orderId`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "orderStatus": "shipped" // Enum: "pending", "confirmed", "shipped", "delivered", "cancelled"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Order status updated",
    "order": { ... }
  }
  ```

## 8. Manage Banners

- **Endpoint**: `POST /banners`
- **Auth**: Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "title": "Summer Sale",
    "link": "/category/sale"
    // "image": (File) Required
  }
  ```
- **Endpoint**: `GET /banners` (List all), `DELETE /banners/:bannerId` (Remove)
