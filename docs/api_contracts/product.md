# Product API Contract (Owner: Fathi)

> **Base URL**: `/product`

## 1. Create Product

- **Endpoint**: `POST /`
- **Auth**: Seller, Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "title": "iPhone 14 Pro", // Required, min: 2, max: 200
    "description": "Latest Apple iPhone...", // Optional, max: 2000
    "price": 999, // Required, min: 0
    "discount": 10, // Optional, min: 0, max: 100
    "stock": 50, // Required, min: 0
    "categoryId": "64b..." // Required (ObjectId)
    // "mainImage": (File) Required
    // "subImages": (Files) Optional (max 5)
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Product created successfully",
    "product": {
      "_id": "64c...",
      "title": "iPhone 14 Pro",
      "slug": "iphone-14-pro",
      "finalPrice": 899.1,
      "avgRating": 0,
      "stock": 50,
      "mainImage": { ... },
      "images": [ ... ],
      "sellerId": "64a...",
      "categoryId": "64b..."
    }
  }
  ```

## 2. Get All Products

- **Endpoint**: `GET /`
- **Auth**: Public
- **Query Params**:
  - `search`: Search by name (e.g., `?search=iphone`)
  - `minPrice`, `maxPrice`: Filter by price range
  - `categoryId`: Filter by category
  - `sort`: Sort options (e.g., `price`, `-price`, `-createdAt` for new arrivals)
  - `page`, `limit`: Pagination (default: page=1, limit=10)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Products fetched successfully",
    "products": [ ... ],
    "pagination": { "currentPage": 1, "totalPages": 5, "totalItems": 50 }
  }
  ```

## 3. Get Single Product

- **Endpoint**: `GET /:productId`
- **Auth**: Public
- **Note**: Should populate reviews.
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product fetched successfully",
    "product": {
      ...,
      "reviews": [ ... ]
    }
  }
  ```

## 4. Update Product

- **Endpoint**: `PATCH /:productId`
- **Auth**: Owner (Seller), Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "title": "iPhone 14 Pro Max",
    "stock": 45,
    "price": 1099,
    "discount": 5
    // "mainImage": (File)
    // "subImages": (Files)
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product updated successfully",
    "product": { ... }
  }
  ```

## 5. Delete Product

- **Endpoint**: `DELETE /:productId`
- **Auth**: Owner (Seller), Admin
- **Note**: Soft delete (`isDeleted: true`).
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Product deleted successfully"
  }
  ```
