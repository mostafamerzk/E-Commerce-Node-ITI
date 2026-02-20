import express from "express"
import { isAuthenticated } from "../../middleware/auth.middleware.js";
import { isAuthorized } from "../../middleware/authorization.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { addwishvalidation } from "./wishlist.validation.js";
import { deletewishlist, getwishlist, postwishlist } from "./wishlist.service.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";

const wishlistRouter=express.Router()

wishlistRouter.get('/user/wishlist',
    isAuthenticated,
asyncHandler(getwishlist))

wishlistRouter.post('/user/wishlist/:productId',
    isAuthenticated,
    validation(addwishvalidation),
 asyncHandler(postwishlist))

wishlistRouter.delete('/user/wishlist/:productId',
    isAuthenticated,
    validation(addwishvalidation),
    asyncHandler(deletewishlist))
export {wishlistRouter}