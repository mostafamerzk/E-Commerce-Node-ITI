import { Review } from "../../DB/Models/review.js";
import { Product } from "../../DB/Models/product.js";

/**
 * Recalculates and saves the average rating and rating count
 * for a product based on its reviews.
 * @param {string|ObjectId} productId
 */
export const updateProductRating = async (productId) => {
    const reviews = await Review.find({ productId, rating: { $exists: true } });
    const ratingCount = reviews.length;
    const avgRating =
        ratingCount > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / ratingCount
            : 0;

    await Product.findByIdAndUpdate(productId,
        { avgRating, ratingCount },
        { new: true });
};
