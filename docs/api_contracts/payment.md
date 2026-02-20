# Payment API Contract (Owner: Mostafa)

> **Base URL**: `/payment`

## 1. Create Checkout Session

- **Endpoint**: `POST /create-checkout-session`
- **Auth**: User
- **Description**: Generates a Stripe Checkout Session URL for the frontend to redirect the user to.
- **Request Body**:
  ```json
  {
    "orderId": "64d..." // Required (ObjectId)
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Checkout session created",
    "url": "https://checkout.stripe.com/pay/cs_test_..."
  }
  ```

## 2. Webhook

- **Endpoint**: `POST /webhook`
- **Auth**: Public (Verified via Stripe Signature)
- **Description**: Receives events from Stripe (e.g., `checkout.session.completed`) to update order status.
- **Response**: `200 OK` (Empty body)
