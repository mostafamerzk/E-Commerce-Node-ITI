import {User} from "../../DB/Models/user.js";
import {Product} from "../../DB/Models/product.js";
import {Order} from "../../DB/Models/order.js";
import {Banner} from "../../DB/Models/banner.js";
import * as productFiltersBuilder from "../../utils/product/build.js";
import * as orderFiltersBuilder from "../../utils/order/build.js";
import * as bannerFiltersBuilder from "../../utils/banner/build.js";
import {orderStatus} from "../../utils/enums/enums.js";
//Admin data Retrival

/**
 * Retrieve all users with pagination and sorted by creation date
 * 
 * @route GET /admin/users
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of users per page
 * @param {Object} res - Express response object
 * @returns {Object} Returns paginated users data with pagination metadata
 * @returns {string} returns.message - Success message
 * @returns {Object} returns.data - Paginated users data
 * @returns {Array} returns.data.docs - Array of user documents
 * @returns {number} returns.data.total - Total number of users
 * @returns {number} returns.data.pages - Total number of pages
 * @returns {number} returns.data.page - Current page number
 * @status {200} Success - Users retrieved successfully
 * @example
 * // Request: GET /admin/users?page=1&limit=10
 * // Response: { message: "all users", data: { docs: [...], total: 50, pages: 5, page: 1 } }
 */
export const getAllUsers = async (req, res,next) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: { createdAt: -1 },
    };

    const users = await User.paginate({}, options);

    return res.status(200).json({message:"all users",data:users}) 
}

/**
 * Retrieve a single user by their MongoDB ObjectId
 * 
 * @route GET /admin/users/:userId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - MongoDB user ID (ObjectId)
 * @param {Object} res - Express response object
 * @returns {Object} User document with all fields
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.data - User object (only if found)
 * @status {200} Success - User found and returned
 * @status {404} Not Found - User with given ID does not exist
 * @example
 * // Request: GET /admin/users/507f1f77bcf86cd799439011
 * // Response: { message: "user found", data: { _id: "507f1f77bcf86cd799439011", userName: "alice123", ... } }
 * // Error: { message: "user not found" }
 */
export const getUserById = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user) {
        return next(new Error("user not found"),{cause: 404});
    }
    return res.status(200).json({message:"user found",data:user})
}



/**
 * Restrict/soft-delete a user by setting isDeleted flag to true
 * 
 * User data remains in database but user cannot access their account
 * This is a soft delete operation - data can be restored with approveUser
 * 
 * @route PATCH /admin/users/:userId/restrict
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - MongoDB user ID (ObjectId)
 * @param {Object} res - Express response object
 * @returns {Object} Updated user document with isDeleted set to true
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.data - Updated user object (only if found)
 * @status {200} Success - User restricted successfully
 * @status {404} Not Found - User with given ID does not exist
 * @example
 * // Request: PATCH /admin/users/507f1f77bcf86cd799439011/restrict
 * // Response: { message: "user restricted", data: { _id: "...", isDeleted: true, ... } }
 * // Error: { message: "user not found" }
 */
export const restrictUser = async (req, res,next) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,{isDeleted:true},{new:true}).lean("-password");
    if (!user) {
        return next(new Error("user not found"),{cause: 404});
    }   
    return res.status(200).json({message:"user restricted",data:user})
}
/**
 * Approve/un-restrict a user by setting isDeleted flag to false
 * This restores access to the user's account if they were previously restricted
 * @route PATCH /admin/users/:userId/approve
 */

export const approveUser = async (req, res, next) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,{isDeleted:false},{new:true});
    if (!user) {
        return next(new Error("user not found"),{cause: 404});
    }
    return res.status(200).json({message:"user approved",data:user})
}

export const getAllProducts = async (req, res) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: productFiltersBuilder.sortObject(req.query.sort)
    };


    const filter = productFiltersBuilder.filterObject(req.query);

    const products = await Product.paginate(filter, options);

    return res.status(200).json({
        message: "all products",    
        data: products
    });
}

export const getProductById = async (req, res, next) => { 
    const {id} = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return next(new Error("product not found"),{cause: 404});
    }
    return res.status(200).json({message:"product found",data:product})
}

export const deleteProduct = async (req, res,next) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,{isDeleted:true},{new:true});    // console.log(product);
    if (!product) {
        return next(new Error("product not found"),{cause: 404});
    }
    return res.status(200).json({success:true, message:"product deleted",data:product})
}
export const recoverProduct = async (req,res,next)=> {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id,{isDeleted:false},{new:true});    // console.log(product);
    if (!product) {
        return next(new Error("product not found"),{cause: 404});
    }
    return res.status(200).json({success:true, message:"product recovered",data:product})
}

/**
 * Retrieve all orders with pagination and sorting
 * 
 * @route GET /admin/orders
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of orders per page
 * @param {string} [req.query.sort] - Sort option (newest, oldest, totalHigh, totalLow, status)
 * @param {string} [req.query.status] - Filter by order status
 * @param {string} [req.query.paymentStatus] - Filter by payment status
 * @param {string} [req.query.shippingStatus] - Filter by shipping status
 * @param {Object} res - Express response object
 * @returns {Object} Returns paginated orders data with pagination metadata
 * @returns {string} returns.message - Success message
 * @returns {Object} returns.orders - Paginated orders data
 * @status {200} Success - Orders retrieved successfully
 * @example
 * // Request: GET /admin/orders?page=1&limit=10&sort=newest&status=pending
 * // Response: { message: "Orders fetched successfully", orders: { docs: [...], total: 50, pages: 5, page: 1 } }
 */
export const getAllOrders = async (req, res) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: orderFiltersBuilder.sortObject(req.query.sort)
    };

    const filter = orderFiltersBuilder.filterObject(req.query);

    const orders = await Order.paginate(filter, options);

    return res.status(200).json({
        message: "Orders fetched successfully",
        orders: orders
    });
}

/**
 * Update order status
 * 
 * @route PATCH /admin/orders/:orderId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.orderId - MongoDB order ID (ObjectId)
 * @param {Object} req.body - Request body
 * @param {string} req.body.orderStatus - New order status (pending, confirmed, shipped, delivered, cancelled)
 * @param {Object} res - Express response object
 * @returns {Object} Updated order document
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.order - Updated order object (only if found)
 * @status {200} Success - Order status updated successfully
 * @status {400} Bad Request - Invalid order status provided
 * @status {404} Not Found - Order with given ID does not exist
 * @example
 * // Request: PATCH /admin/orders/507f1f77bcf86cd799439011
 * // Body: { "orderStatus": "shipped" }
 * // Response: { message: "Order status updated", order: { _id: "...", status: "shipped", ... } }
 */
export const updateOrderStatus = async (req, res, next) => {
    const {orderId} = req.params;
    const {orderStatus: newStatus} = req.body;
    
    const validStatuses = Object.values(orderStatus);
    if (!validStatuses.includes(newStatus)) {
        return next(new Error("Invalid order status"));
    }
    
    const order = await Order.findByIdAndUpdate(orderId, {status: newStatus}, {new: true});
    if (!order) {
        return next(new Error("order not found"),{cause: 404});
    }
    return res.status(200).json({message: "Order status updated", order: order});
}

/**
 * Retrieve all banners with pagination and sorting
 * 
 * @route GET /admin/banners
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of banners per page
 * @param {string} [req.query.sort] - Sort option (newest, oldest, title)
 * @param {boolean} [req.query.isActive] - Filter by active status
 * @param {string} [req.query.title] - Search banners by title
 * @param {Object} res - Express response object
 * @returns {Object} Returns paginated banners data with pagination metadata
 * @returns {string} returns.message - Success message
 * @returns {Object} returns.banners - Paginated banners data
 * @status {200} Success - Banners retrieved successfully
 * @example
 * // Request: GET /admin/banners?page=1&limit=10&sort=newest&isActive=true
 * // Response: { message: "Banners fetched successfully", banners: { docs: [...], total: 50, pages: 5, page: 1 } }
 */
export const getAllBanners = async (req, res) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: bannerFiltersBuilder.sortObject(req.query.sort)
    };

    const filter = bannerFiltersBuilder.filterObject(req.query);

    const banners = await Banner.paginate(filter, options);

    return res.status(200).json({
        message: "Banners fetched successfully",
        banners: banners
    });
}

/**
 * Create a new banner with image upload
 * 
 * @route POST /admin/banners
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Banner title (Required)
 * @param {string} req.body.link - Banner link/URL (Required)
 * @param {Object} req.file - Uploaded image file (Required)
 * @param {Object} res - Express response object
 * @returns {Object} Created banner document
 * @returns {string} returns.message - Success message
 * @returns {Object} returns.banner - Created banner object
 * @status {201} Created - Banner created successfully
 * @status {400} Bad Request - Missing required fields or validation error
 * @example
 * // Request: POST /admin/banners (multipart/form-data)
 * // Body: { title: "Summer Sale", link: "/category/sale", file: <image> }
 * // Response: { message: "Banner created successfully", banner: { _id: "...", title: "Summer Sale", ... } }
 */
export const createBanner = async (req, res, next) => {
    const {title, link} = req.body;
    const image = req.file?.filename;

    if (!title || !link || !image) {
        return next(new Error("Title, link, and image are required"));
    }

    const banner = await Banner.create({title, link, image, isActive: true});
    
    return res.status(201).json({
        message: "Banner created successfully",
        banner: banner
    });
}

/**
 * Retrieve a single banner by ID
 * 
 * @route GET /admin/banners/:bannerId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.bannerId - MongoDB banner ID (ObjectId)
 * @param {Object} res - Express response object
 * @returns {Object} Banner document
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.banner - Banner object (only if found)
 * @status {200} Success - Banner found and returned
 * @status {404} Not Found - Banner with given ID does not exist
 * @example
 * // Request: GET /admin/banners/507f1f77bcf86cd799439011
 * // Response: { message: "Banner found", banner: { _id: "507f1f77bcf86cd799439011", title: "Summer Sale", ... } }
 */
export const getBannerById = async (req, res, next) => {
    const {bannerId} = req.params;
    const banner = await Banner.findById(bannerId);
    
    if (!banner) {
        return next(new Error("Banner not found"),{cause: 404});
    }
    
    return res.status(200).json({
        message: "Banner found",
        banner: banner
    });
}

/**
 * Update a banner with optional image upload
 * 
 * @route PATCH /admin/banners/:bannerId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.bannerId - MongoDB banner ID (ObjectId)
 * @param {Object} req.body - Request body (all fields optional)
 * @param {string} [req.body.title] - Banner title
 * @param {string} [req.body.link] - Banner link/URL
 * @param {boolean} [req.body.isActive] - Active status
 * @param {Object} [req.file] - Uploaded image file (optional)
 * @param {Object} res - Express response object
 * @returns {Object} Updated banner document
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.banner - Updated banner object (only if found)
 * @status {200} Success - Banner updated successfully
 * @status {404} Not Found - Banner with given ID does not exist
 * @example
 * // Request: PATCH /admin/banners/507f1f77bcf86cd799439011
 * // Body: { title: "Winter Sale", link: "/category/winter", isActive: false }
 * // Response: { message: "Banner updated successfully", banner: { _id: "...", title: "Winter Sale", ... } }
 */
export const updateBanner = async (req, res, next) => {
    const {bannerId} = req.params;
    const {title, link, isActive} = req.body;
    
    const updateData = {};
    if (title) updateData.title = title;
    if (link) updateData.link = link;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (req.file) updateData.image = req.file.filename;
    
    const banner = await Banner.findByIdAndUpdate(bannerId, updateData, {new: true});
    if (!banner) {
        return next(new Error("Banner not found"),{cause: 404});
    }
    
    return res.status(200).json({
        message: "Banner updated successfully",
        banner: banner
    });
}

/**
 * Soft delete a banner by setting isDeleted flag to true
 * 
 * Banner data remains in database but is considered deleted
 * This is a soft delete operation - data can be restored if needed
 * 
 * @route DELETE /admin/banners/:bannerId
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.bannerId - MongoDB banner ID (ObjectId)
 * @param {Object} res - Express response object
 * @returns {Object} Response object
 * @returns {string} returns.message - Success or error message
 * @status {200} Success - Banner deleted successfully
 * @status {404} Not Found - Banner with given ID does not exist
 * @example
 * // Request: DELETE /admin/banners/507f1f77bcf86cd799439011
 * // Response: { message: "Banner deleted successfully" }
 */
export const deleteBanner = async (req, res, next) => {
    const {bannerId} = req.params;
    const banner = await Banner.findByIdAndUpdate(bannerId, {isDeleted: true}, {new: true});
    
    if (!banner) {
        return next(new Error("Banner not found"),{cause: 404});
    }
    
    return res.status(200).json({
        message: "Banner deleted successfully"
    });
}
export const recoverBanner = async (req, res, next) => {
    const {bannerId} = req.params;
    const banner = await Banner.findByIdAndUpdate(bannerId, {isDeleted: false}, {new: true});
    
    if (!banner) {
        return next(new Error("Banner not found"),{cause: 404});
    }
    
    return res.status(200).json({
        message: "Banner recovered successfully",
        banner: banner
    });
}