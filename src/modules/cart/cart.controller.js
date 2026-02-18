import { Router } from "express";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { addCartItem, getCartItems, updateCartItemQuantity, removeCartItem, clearCart} from "./cart.service.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addCartItemSchema, updateCartItemSchema } from "./cart.validation.js";

export const cartRouter = new Router();

cartRouter.get('/', isAuthenticated, asyncHandler(getCartItems))

cartRouter.post(
    '/',
    isAuthenticated,
    validation(addCartItemSchema),
    asyncHandler(addCartItem)
)

cartRouter.patch(
    '/:productId',
    isAuthenticated,
    validation(updateCartItemSchema),
    asyncHandler(updateCartItemQuantity)
)

cartRouter.delete(
  '/:productId',
  isAuthenticated,
  asyncHandler(removeCartItem)
);

cartRouter.delete(
  '/',
  isAuthenticated,
  asyncHandler(clearCart)
);