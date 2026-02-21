
import {Review} from "../../DB/Models/review.js";
import {Product }from "../../DB/Models/product.js";
import { updateProductRating } from "../../utils/review/updateProductRating.js";
import * as  builder from "../../utils/review/build.js";

// Add Review
export const addReview = async (req, res, next) => {
    const {rating, comment } = req.body;
    const { productId } = req.params;
    const userId =req.user._id;
    const product = await Product.findById(productId);
    if (!product || product.isDeleted) {
        return next(new Error("Product not found"),{cause: 404});
    }
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
        return next(new Error("You have already reviewed this product"), { cause: 400 });
    }
    const review = await Review.create({
        userId,
        productId,
        rating,
        comment
    });
    await updateProductRating(productId);
    res.status(201).json({
        status: "Review added successfully",
        review: review
    });
};

// Get Product Reviews
export const getProductReviews = async (req, res, next) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: builder.sortObject(req.query.sort)
    };
    const filter = builder.filterObject(req.query,req.params);
    const reviews = await Review.paginate(filter,options)    
    res.status(200).json({
        message: "reviews fetched successfully",
        reviews: {
            reviews,
            pages: options.pages,
            page: options.page,
            total: options.total
        }
    });
};
// Update Review
export const updateReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;
    console.log(userId);
    const review = await Review.findById(reviewId);
    if (!review) {
        return next(new Error("Review not found"),{cause: 404});
    }

    if (review.userId.toString() !== userId.toString()) {
        return next(new Error("You can only update your own reviews", 403));
    }

    review.rating = rating? rating:review.rating;
    review.comment = comment? comment:review.comment;
    await review.save();

    // Update product's average rating
    await updateProductRating(review.productId);

    res.status(200).json({
        message: "Review updated successfully",
        review: review
    });
};  

// Delete Review
export const deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const user= req.user;

    const review = await Review.findById(reviewId);
    if (!review) {
        return next(new Error("Review not found"),{cause: 404});
    }

    if (review.userId.toString() !== user._id.toString() && user.role !== roles.admin) {
        return next(new Error("You can only delete your own reviews"), { cause: 403 });
    }

    await review.deleteOne();

    await updateProductRating(review.productId);

    res.status(200).json({
        message: "Review deleted successfully",
    });
};