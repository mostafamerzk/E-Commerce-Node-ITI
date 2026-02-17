# Wishlist API Contract (Owner: Mokhtar)

> **Base URL**: `/user/wishlist`

## 1. Get Wishlist

- **Endpoint**: `GET /`
- **Auth**: User
- **Description**: Returns user's wishlist populated with product details.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Wishlist fetched successfully",
    "wishlist": [
      {
        "_id": "64c...",
        "title": "iPhone 14 Pro",
        "price": 999,
        "mainImage": { ... }
      }
    ]
  }
  ```

## 2. Add to Wishlist

- **Endpoint**: `POST /:productId`
- **Auth**: User
- **Description**: Adds a product ID to the user's `wishlist` array.
- **Request Body**: `{}` (Empty)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product added to wishlist",
    "wishlist": [ ... ]
  }
  ```

## 3. Remove from Wishlist

- **Endpoint**: `DELETE /:productId`
- **Auth**: User
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product removed from wishlist",
    "wishlist": [ ... ]
  }
  ```
