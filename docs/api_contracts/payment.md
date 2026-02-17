# Payment API Contract (Owner: Mostafa)

> **Base URL**: `/payment` (or `/order/payment` depending on implementation preference)

## 1. Create Payment Intent

- **Endpoint**: `POST /create-intent`
- **Auth**: User
- **Description**: Generates a client secret for Stripe (or other gateway) frontend checkout.
- **Request Body**:
  ```json
  {
    "orderId": "64d..." // Required (ObjectId)
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Payment intent created",
    "clientSecret": "pi_1234567890_secret_..."
  }
  ```

## 2. Webhook

- **Endpoint**: `POST /webhook`
- **Auth**: Public (Verified via Stripe Signature)
- **Description**: Receives events from payment provider (e.g., `payment_intent.succeeded`) to update order status.
- **Response**: `200 OK` (Empty body)
