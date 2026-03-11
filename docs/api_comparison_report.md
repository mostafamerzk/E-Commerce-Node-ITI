# API Comparison Report

This report compares the API contracts defined in `docs/api_contracts/` with the actual implementation in the `src/modules/` directory.

## Summary Table

| Module       | Contract Status | Implementation Status      | Discrepancies / Notes                                               |
| :----------- | :-------------- | :------------------------- | :------------------------------------------------------------------ |
| **Admin**    | Exist           | Fully Implemented          | Matches contract well.                                              |
| **Auth**     | **Missing**     | Implemented                | Implements register, login, activate, forget/reset pass, new token. |
| **User**     | **Missing**     | Implemented                | Implements profile management, OTP, and log out.                    |
| **Cart**     | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Category** | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Order**    | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Payment**  | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Product**  | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Review**   | Exist           | Fully Implemented          | Matches contract exactly.                                           |
| **Seller**   | Exist           | Partially Implemented      | Missing `GET /orders` (marked as Bonus in contract).                |
| **Wishlist** | Exist           | Implemented (URL Mismatch) | Actual path: `/wish/user/wishlist`. Contract: `/user/wishlist`.     |

---

## Detailed Findings

### 1. Missing Contracts

The following modules have implementations but no corresponding files in `docs/api_contracts/`:

- **Auth**: Handles registration, login, and password management.
- **User**: Handles profile updates, password changes, account freezing, and OTP verification.

### 2. URL Discrepancies

- **Wishlist Module**:
  - **Contract**: Base URL `/user/wishlist`
  - **Implementation**: `app.use("/wish", wishlistRouter)` + `wishlistRouter.get('/user/wishlist', ...)` results in the actual path being `/wish/user/wishlist`.
  - **Recommendation**: Align the base URL in `app.controller.js` or the routes in `wishlist.controller.js` with the contract.

### 3. Missing/Added APIs

- **Seller Module**:
  - **Missing**: `GET /orders` (List orders containing seller's products). Note: This was marked as a "Bonus" in the contract.
- **Admin Module**:
  - **Note**: The "Delete Banner" endpoint calls `deActivateBanner`, which likely performs a soft-delete/deactivation rather than a hard delete. This aligns with the "Activate Banner" functionality.

### 4. Project Structure Observations

- **Redundant Registration**: In `src/modules/app.controller.js`, the `wishlistRouter` is registered twice under the `/wish` path (lines 24 and 30).
- **Correct Webhook Handling**: The `/payment/webhook` route correctly uses `express.raw` for signature verification, ensuring Stripe integration works as expected.

## Conclusion

The project implementation is highly consistent with the provided API contracts for most core modules. The primary areas for improvement are documenting the **Auth** and **User** modules and resolving the URL mismatch in the **Wishlist** module.
