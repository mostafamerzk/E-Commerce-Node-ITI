# Admin API Contract (Owner: Issac)

> **Base URL**: `/admin`

## 1. Get All Users

- **Endpoint**: `GET /users`
- **Auth**: Admin
- **Query Params**: `search`, `page`, `limit`, `role`, `isBlocked`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Users fetched successfully",
    "users": [ ... ]
  }
  ```

## 2. Get User by ID

- **Endpoint**: `GET /users/:userId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "user found",
    "data": { "_id": "...", "userName": "...", "email": "..." }
  }
  ```
- **Error Response (404)**: `{ "message": "user not found" }`

## 3. Restrict User

- **Endpoint**: `PATCH /users/:userId/restrict`
- **Auth**: Admin
- **Description**: Soft deletes the user or sets `isBlocked: true`.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "User restricted successfully"
  }
  ```

## 4. Approve User

- **Endpoint**: `PATCH /users/:userId/approve`
- **Auth**: Admin
- **Description**: Re-activates a user.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "User approved successfully"
  }
  ```

## 4.5. Update User Role

- **Endpoint**: `PATCH /users/:userId/role`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "role": "seller" // or "user", "admin"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "User role updated successfully"
  }
  ```

## 5. Get All Products

- **Endpoint**: `GET /products`
- **Auth**: Admin
- **Query Params**: `page`, `limit`, `sort`, `category`, `minPrice`, `maxPrice`, `rating`, `inStock`, `search`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Products fetched successfully",
    "products": [ ... ]
  }
  ```

## 6. Get Product by ID

- **Endpoint**: `GET /products/:productId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "product found",
    "data": { "_id": "...", "name": "...", "price": 100 }
  }
  ```
- **Error Response (404)**: `{ "message": "product not found" }`

## 7. Delete Product

- **Endpoint**: `DELETE /products/:productId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```

## 8. Recover Product

- **Endpoint**: `PATCH /products/:productId/recover`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product recovered successfully"
  }
  ```

## 9. Get All Orders

- **Endpoint**: `GET /orders`
- **Auth**: Admin
- **Query Params**: `page`, `limit`, `sort`, `orderStatus`, `paymentStatus`, `shippingStatus`, `minTotal`, `maxTotal`, `startDate`, `endDate`, `userId`, `paymentMethod`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": [ ... ]
  }
  ```

## 10. Get Order by ID

- **Endpoint**: `GET /orders/:orderId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "order found",
    "data": { "_id": "...", "status": "pending", "totalAmount": 500 }
  }
  ```
- **Error Response (404)**: `{ "message": "order not found" }`

## 11. Update Order Status

- **Endpoint**: `PATCH /orders/:orderId/status`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "orderStatus": "shipped"
  }
  ```
- **Valid Statuses**: `pending`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Order status updated",
    "order": { ... }
  }
  ```

## 12. Get All Banners

- **Endpoint**: `GET /banners`
- **Auth**: Admin
- **Query Params**: `page`, `limit`, `sort`, `isActive`, `search`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Banners fetched successfully",
    "banners": [ ... ]
  }
  ```

## 13. Create Banner

- **Endpoint**: `POST /banners`
- **Auth**: Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "title": "Summer Sale",
    "link": "/category/sale",
    "image": "(File)"
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Banner created successfully",
    "banner": { "_id": "...", "title": "Summer Sale", "isActive": true }
  }
  ```

## 14. Get Banner by ID

- **Endpoint**: `GET /banners/:bannerId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Banner found",
    "banner": { "_id": "...", "title": "Summer Sale" }
  }
  ```

## 15. Update Banner

- **Endpoint**: `PATCH /banners/:bannerId`
- **Auth**: Admin
- **Request Body (multipart/form-data)** - All optional:
  ```json
  {
    "title": "Winter Sale",
    "link": "/category/winter",
    "isActive": true,
    "image": "(File)"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Banner updated successfully",
    "banner": { ... }
  }
  ```

## 16. Delete (Deactivate) Banner

- **Endpoint**: `DELETE /banners/:bannerId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Banner deactivated successfully"
  }
  ```

## 17. Activate Banner

- **Endpoint**: `PATCH /banners/:bannerId/activate`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Banner activated successfully"
  }
  ```

## 18. Get Analytics

- **Endpoint**: `GET /analytics`
- **Auth**: Admin
- **Query Params**: `startDate`, `endDate` (ISO dates)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Analytics fetched successfully",
    "data": { ... }
  }
  ```

## 19. Get All Sellers

- **Endpoint**: `GET /sellers`
- **Auth**: Admin
- **Query Params**: Same as Get All Users
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Sellers fetched successfully",
    "sellers": [ ... ]
  }
  ```

## 20. Get Seller by ID

- **Endpoint**: `GET /sellers/:sellerId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller found",
    "data": { ... }
  }
  ```

## 21. Approve Seller

- **Endpoint**: `PATCH /sellers/:sellerId/approve`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller approved successfully"
  }
  ```

## 22. Restrict Seller

- **Endpoint**: `PATCH /sellers/:sellerId/restrict`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller restricted successfully"
  }
  ```

## 23. Coupon Management

### Create Coupon

- **Endpoint**: `POST /coupons`
- **Auth**: Admin
- **Request Body**:
  ```json
  {
    "code": "SUMMER50",
    "discountType": "percentage",
    "discountValue": 50,
    "expiresAt": "2024-12-31"
  }
  ```

### Get All Coupons

- **Endpoint**: `GET /coupons`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Coupons fetched successfully",
    "coupons": [ ... ]
  }
  ```

### Get Coupon Details

- **Endpoint**: `GET /coupons/:id`
- **Auth**: Admin

### Update Coupon

- **Endpoint**: `PATCH /coupons/:id`
- **Auth**: Admin

### Delete Coupon

- **Endpoint**: `DELETE /coupons/:id`
- **Auth**: Admin

## 24. Review Moderation

- **Endpoint**: `GET /reviews`
- **Auth**: Admin
- **Query Params**: `page`, `limit`, `productId`, `userId`, `rating`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Reviews fetched successfully",
    "reviews": [ ... ]
  }
  ```
