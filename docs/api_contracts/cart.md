# Cart API Contract (Owner: Fathi)

> **Base URL**: `/cart`

## 1. Add to Cart

- **Endpoint**: `POST /`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "productId": "64c...", // Required (ObjectId)
    "quantity": 2 // Optional, default: 1, min: 1
  }
  ```
- **Validation**: Check stock availability.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Item added to cart",
    "cart": {
      "userId": "64a...",
      "products": [{ "productId": "64c...", "quantity": 2, "price": 999 }],
      "totalPrice": 1998
    }
  }
  ```

## 2. Get Cart

- **Endpoint**: `GET /`
- **Auth**: User
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Cart fetched successfully",
    "cart": { ... }
  }
  ```

## 3. Update Cart Item Quantity

- **Endpoint**: `PATCH /:productId`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "quantity": 5 // Required, min: 1
    // OR "operator": "+" / "-"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Cart updated",
    "cart": { ... }
  }
  ```

## 4. Remove Item from Cart

- **Endpoint**: `DELETE /:productId`
- **Auth**: User
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Item removed from cart",
    "cart": { ... }
  }
  ```

## 5. Clear Cart

- **Endpoint**: `DELETE /`
- **Auth**: User
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Cart cleared successfully"
  }
  ```
