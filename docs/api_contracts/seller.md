# Seller API Contract (Owner: Mokhtar)

> **Base URL**: `/seller`

## 1. Seller Profile Setup / Update

- **Endpoint**: `PATCH /profile`
- **Auth**: Seller (User with role 'seller')
- **Request Body**:
  ```json
  {
    "storeName": "Tech Hub",
    "phone": "+201000000000",
    "storeDescription": "Best tech in town"
    // "storeImage": (File) Optional
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller profile updated",
    "user": { ... }
  }
  ```

## 2. Get Seller Profile

- **Endpoint**: `GET /profile`
- **Auth**: Seller
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Profile fetched",
    "user": { ... }
  }
  ```

## 3. Get Seller Products

- **Endpoint**: `GET /products`
- **Auth**: Seller
- **Description**: List products created by this seller.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller products fetched",
    "products": [ ... ]
  }
  ```

## 4. Get Seller Inventory

- **Endpoint**: `GET /inventory`
- **Auth**: Seller
- **Description**: Overview of stock levels.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Inventory fetched",
    "inventory": [
      { "productId": "...", "title": "...", "stock": 50, "sold": 10 }
    ]
  }
  ```

## 5. Get Seller Orders (Bonus)

- **Endpoint**: `GET /orders`
- **Auth**: Seller
- **Description**: List orders containing seller's products.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Seller orders fetched",
    "orders": [ ... ]
  }
  ```
