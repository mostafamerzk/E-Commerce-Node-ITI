# Review API Contract (Owner: Issac)

> **Base URL**: `/review`

## 1. Add Review

- **Endpoint**: `POST /:productId`
- **Auth**: User
- **Request Body**:
  ```json
  {
    "rating": 5, // Required, min: 1, max: 5
    "comment": "Great product!", // Optional, max: 1000 chars
    "parentComment": "64f..." // Optional, ID of parent review
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Review added successfully",
    "review": {
      "_id": "64f...",
      "userId": "64a...",
      "productId": "64c...",
      "rating": 5,
      "comment": "Great product!",
      "parentComment": "64f..."
    }
  }
  ```

## 2. Get Product Reviews

- **Endpoint**: `GET /:productId`
- **Auth**: Public
- **Query Params**: `page`, `limit`
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Reviews fetched successfully",
    "reviews": [ ... ]
  }
  ```

## 3. Update Review

- **Endpoint**: `PATCH /:reviewId`
- **Auth**: User (Owner of review)
- **Request Body**:
  ```json
  {
    "rating": 4,
    "comment": "Updated comment..."
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Review updated successfully",
    "review": { ... }
  }
  ```

## 4. Delete Review

- **Endpoint**: `DELETE /:reviewId`
- **Auth**: User (Owner) or Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Review deleted successfully"
  }
  ```
