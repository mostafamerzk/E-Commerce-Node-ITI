# Category API Contract (Owner: Mostafa)

> **Base URL**: `/category`

## 1. Create Category

- **Endpoint**: `POST /`
- **Auth**: Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "name": "Electronics", // Required, min: 2, max: 50
    "parentCategoryId": "64b..." // Optional (ObjectId)
    // "image": (File) Required (handled via Multer)
  }
  ```
- **Success Response (201 Created)**:
  ```json
  {
    "message": "Category created successfully",
    "category": {
      "_id": "64b...",
      "name": "Electronics",
      "slug": "electronics",
      "image": { "secure_url": "...", "public_id": "..." },
      "createdBy": "64a...",
      "createdAt": "..."
    }
  }
  ```

## 2. Get All Categories

- **Endpoint**: `GET /`
- **Auth**: Public
- **Query Params**:
  - None specified (conventionally supports pagination if needed, but simple list implied)
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Categories fetched successfully",
    "categories": [ ... ]
  }
  ```

## 3. Get Single Category

- **Endpoint**: `GET /:categoryId`
- **Auth**: Public
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Category fetched successfully",
    "category": { ... }
  }
  ```

## 4. Update Category

- **Endpoint**: `PATCH /:categoryId`
- **Auth**: Admin
- **Request Body (multipart/form-data)**:
  ```json
  {
    "name": "Home Electronics" // Optional
    // "image": (File) Optional
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Category updated successfully",
    "category": { ... }
  }
  ```

## 5. Delete Category

- **Endpoint**: `DELETE /:categoryId`
- **Auth**: Admin
- **Success Response (200 OK)**:
  ```json
  {
    "message": "Category deleted successfully"
  }
  ```
