# Order API Contract (Owner: Mostafa)

> **Base URL**: `/order` (Checkout usually part of this or separate `/checkout` route)

## 1. Checkout Summary

- **Endpoint**: `POST /checkout`
- **Auth**: User (or Guest)
- **Description**: Calculates total price including shipping/tax/discounts before finalizing order.
- **Request Body**:
  ```json
  {
    "couponCode": "SUMMER50", // Optional
    "shippingAddress": { ... } // Optional (for shipping calc)
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "subtotal": 1000,
    "shipping": 50,
    "discount": 100,
    "total": 950
  }
  ```

## 2. Place Order

- **Endpoint**: `POST /`
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
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Order placed successfully",
    "order": {
      "_id": "64e...",
      "orderNumber": "ORD-12345",
      "orderStatus": "pending",
      "paymentStatus": "unpaid",
      ...
    }
  }
  ```

## 3. Get User Orders

- **Endpoint**: `GET /`
- **Auth**: User
- **Query Params**: `page`, `limit`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": [ ... ]
  }
  ```

## 4. Get Single Order

- **Endpoint**: `GET /:orderId`
- **Auth**: User
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Order fetched successfully",
    "order": { ... }
  }
  ```

## 5. Cancel Order

- **Endpoint**: `PATCH /:orderId/cancel`
- **Auth**: User (Owner)
- **Condition**: Only if `orderStatus` is `pending` or `confirmed`.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Order cancelled successfully",
    "order": { "orderStatus": "cancelled", ... }
  }
  ```
