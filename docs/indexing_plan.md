# MongoDB Indexing Plan

> **Purpose**: Optimize query performance across all collections based on expected query patterns.
> **Rule**: Every index has a cost (storage + slower writes), so we only index fields that appear in frequent queries.

---

## What Mongoose Already Indexes for Free

Fields marked `unique: true` automatically get a unique index. No need to add them manually:

| Collection | Auto-Indexed Field                        |
| ---------- | ----------------------------------------- |
| Users      | `email`, `userName`                       |
| Categories | `name`, `slug`                            |
| Products   | `slug`                                    |
| Carts      | `userId`                                  |
| Orders     | `orderNumber`                             |
| Reviews    | `{ userId, productId }` (compound unique) |

---

## Additional Indexes to Add

### Products (highest priority — most queried collection)

| Index                                    | Type     | Why                                                                                                                                                                        |
| ---------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `{ categoryId: 1, finalPrice: 1 }`       | Compound | **Filter by category + sort/range by price** — the most common product listing query. Covers both `/product?categoryId=x` and `/product?categoryId=x&minPrice=&maxPrice=`. |
| `{ title: "text", description: "text" }` | Text     | **Full-text search** — powers `GET /product?search=keyword`. MongoDB text indexes support word stemming and relevance scoring.                                             |
| `{ createdBy: 1 }`                       | Single   | **Seller's products** — used by `GET /seller/products` to list a seller's own products.                                                                                    |
| `{ isDeleted: 1, categoryId: 1 }`        | Compound | **Active products in category** — almost every product query filters out deleted products first, then by category.                                                         |
| `{ finalPrice: 1 }`                      | Single   | **Global price sorting/filtering** — covers queries that sort all products by price without a category filter.                                                             |
| `{ createdAt: -1 }`                      | Single   | **Newest products** — "latest arrivals" sorting. `-1` for descending (newest first).                                                                                       |

```javascript
// In product.js — add after schema definition, before model export:
productSchema.index({ categoryId: 1, finalPrice: 1 });
productSchema.index({ title: "text", description: "text" });
productSchema.index({ createdBy: 1 });
productSchema.index({ isDeleted: 1, categoryId: 1 });
productSchema.index({ finalPrice: 1 });
productSchema.index({ createdAt: -1 });
```

---

### Orders

| Index                          | Type     | Why                                                                                                                                                                      |
| ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{ userId: 1, createdAt: -1 }` | Compound | **User's order history** — `GET /user/orders` and `GET /order` always filter by user and sort by newest first. The compound index covers both filter + sort in one scan. |
| `{ orderStatus: 1 }`           | Single   | **Admin order management** — `GET /admin/orders?status=pending` filters orders by status.                                                                                |
| `{ createdAt: -1 }`            | Single   | **Admin time-based queries** — "orders from last 7 days", dashboard stats.                                                                                               |

```javascript
// In order.js:
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
```

---

### Reviews

| Index                             | Type     | Why                                                                                                                                                                                                                                  |
| --------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `{ productId: 1, createdAt: -1 }` | Compound | **Product reviews page** — `GET /review/:productId` needs all reviews for a product sorted by newest. The existing unique compound index `{ userId, productId }` does NOT cover this query efficiently because `userId` comes first. |

```javascript
// In review.js:
reviewSchema.index({ productId: 1, createdAt: -1 });
```

---

### Categories

| Index                     | Type   | Why                                                                                                                        |
| ------------------------- | ------ | -------------------------------------------------------------------------------------------------------------------------- |
| `{ parentCategoryId: 1 }` | Single | **Subcategory listing** — "get all subcategories of Electronics". Without this index, MongoDB does a full collection scan. |

```javascript
// In category.js:
categorySchema.index({ parentCategoryId: 1 });
```

---

### Users

| Index                       | Type     | Why                                                                               |
| --------------------------- | -------- | --------------------------------------------------------------------------------- |
| `{ role: 1, isDeleted: 1 }` | Compound | **Admin user management** — `GET /admin/users` filters by role and active status. |

```javascript
// In user.js:
user.index({ role: 1, isDeleted: 1 });
```

---

### Banners

| Index                       | Type     | Why                                                                                                                   |
| --------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `{ isActive: 1, order: 1 }` | Compound | **Homepage banners** — fetch only active banners sorted by display order. This is a hot query on every homepage load. |

```javascript
// In banner.js:
bannerSchema.index({ isActive: 1, order: 1 });
```

---

### Carts

> No additional indexes needed. `userId` is already unique-indexed, and cart operations are always by userId.

---

## Summary — Total Indexes Per Collection

| Collection     | Auto Indexes            | New Indexes | Total |
| -------------- | ----------------------- | ----------- | ----- |
| **Users**      | 2 (`email`, `userName`) | 1           | 3     |
| **Products**   | 1 (`slug`)              | 6           | 7     |
| **Categories** | 2 (`name`, `slug`)      | 1           | 3     |
| **Carts**      | 1 (`userId`)            | 0           | 1     |
| **Orders**     | 1 (`orderNumber`)       | 3           | 4     |
| **Reviews**    | 1 (`userId+productId`)  | 1           | 2     |
| **Banners**    | 0                       | 1           | 1     |

> **Products have the most indexes** (7) because they're the most queried collection — search, filter, sort, pagination, seller listing all go through Products.

---

## When NOT to Index

- **Don't index `totalPrice` on Cart** — carts are always fetched by `userId` (already indexed), never searched by price.
- **Don't index `paymentStatus` on Order separately** — it's rarely queried alone; it's usually combined with `orderStatus` or `userId`, which are already indexed.
- **Don't index `isLogged` on User** — only used during the current session check, not for listing queries.
