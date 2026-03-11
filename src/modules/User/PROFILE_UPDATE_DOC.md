# User Profile Update API Documentation

## Endpoint

**Method:** `PATCH`  
**URL:** `/user/profile/update`  
**Authentication:** Required (Bearer Token)  
**Authorization:** User role

## Request Body Format

All fields are optional. You can update any combination of them.

```json
{
  "userName": "john_doe_99",
  "phone": "0123456789",
  "addressId": "65f...123", // Required for updating or deleting an address
  "address": {
    // Required for adding or updating an address
    "street": "123 Main St",
    "city": "Cairo",
    "country": "Egypt",
    "postalCode": "11511"
  }
}
```

### Address Operations Logic

1.  **Add Address**: Send `address` without `addressId`.
2.  **Update Address**: Send both `address` and `addressId`.
3.  **Delete Address**: Send `addressId` without `address`.

## Validation Schema (Joi)

```javascript
export const updateUser = joi
  .object({
    userName: joi.string().min(5).max(15),
    phone: joi.string(),
    addressId: joi.string().hex().length(24),
    address: joi.object({
      street: joi.string().trim(),
      city: joi.string().trim(),
      country: joi.string().trim(),
      postalCode: joi.string().trim(),
    }),
  })
  .required();
```

## Response Format

### Success (200 OK)

```json
{
  "success": true,
  "message": "updated successfully"
}
```

### Error (Validation/Auth)

- **400 Bad Request**: Validation failed or invalid data.
- **401 Unauthorized**: Missing or invalid token.
- **403 Forbidden**: User not authorized.
