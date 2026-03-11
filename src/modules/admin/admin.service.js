import { User } from "../../DB/Models/user.js";
import { Product } from "../../DB/Models/product.js";
import { Order } from "../../DB/Models/order.js";
import { Banner } from "../../DB/Models/banner.js";
import { Coupon } from "../../DB/Models/coupon.js";
import { Review } from "../../DB/Models/review.js";
import mongoose from "mongoose";
import * as productFiltersBuilder from "../../utils/product/build.js";
import * as orderFiltersBuilder from "../../utils/order/build.js";
import * as bannerFiltersBuilder from "../../utils/banner/build.js";
import { orderStatus } from "../../utils/enums/enums.js";
import { cloud } from "../../utils/multer/cloud.config.js";
import { orderEvent } from "../../utils/email/email.event.js";
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
export const getAllUsers = async (req, res, next) => {
  const { page = 1, limit = 10, search, role, isBlocked } = req.query;
  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
  };

  const filter = {};
  if (search) {
    filter.$or = [
      { userName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }
  if (role) filter.role = role;
  if (isBlocked !== undefined) {
    const statusField = role === "seller" ? "isBlocked" : "isDeleted";
    filter[statusField] = isBlocked === "true" ? true : { $ne: true };
  }

  const users = await User.paginate(filter, options);

  return res.status(200).json({
    message: "all users",
    data: users,
    total: users.totalDocs,
    pages: users.totalPages,
    page: users.page,
    docs: users.docs,
  });
};

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
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "user found", data: user });
};

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
export const restrictUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  const statusField = user.role === "seller" ? "isBlocked" : "isDeleted";
  user[statusField] = true;
  user.passwordChangeTime = Date.now();
  await user.save();

  return res.status(200).json({ message: "user restricted", data: user });
};

/**
 * Approve/un-restrict a user
 * This restores access to the user's account if they were previously restricted
 * @route PATCH /admin/users/:userId/approve
 */

export const approveUser = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  const statusField = user.role === "seller" ? "isBlocked" : "isDeleted";
  user[statusField] = false;
  await user.save();

  return res.status(200).json({ message: "user approved", data: user });
};

export const getAllProducts = async (req, res) => {
  const options = {
    page: req.query.page || 1,
    limit: req.query.limit || 10,
    sort: productFiltersBuilder.sortObject(req.query.sort),
  };

  const filter = productFiltersBuilder.filterObject(req.query);

  const products = await Product.paginate(filter, options);

  return res.status(200).json({
    message: "Products fetched successfully",
    products: products.docs,
    data: products,
    total: products.totalDocs,
    pages: products.totalPages,
    page: products.page,
  });
};

export const getProductById = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "product found", data: product });
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  return res
    .status(200)
    .json({ success: true, message: "product deleted", data: product });
};
export const recoverProduct = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(
    id,
    { isDeleted: false },
    { new: true },
  );
  if (!product) {
    return next(new Error("product not found", { cause: 404 }));
  }
  return res
    .status(200)
    .json({ success: true, message: "product recovered", data: product });
};

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
    sort: orderFiltersBuilder.sortObject(req.query.sort),
  };

  const filter = orderFiltersBuilder.filterObject(req.query);

  const orders = await Order.paginate(filter, options);

  return res.status(200).json({
    message: "Orders fetched successfully",
    orders: orders.docs,
    data: orders,
    total: orders.totalDocs,
    pages: orders.totalPages,
    page: orders.page,
  });
};
export const getOrderById = async (req, res, next) => {
  const { id } = req.params;
  const order = await Order.findById(id);
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }
  return res.status(200).json({ message: "Order found", data: order });
};
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
 * // Error: { message: "order not found" }
 */
// Valid status transitions map
const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "returned"],
  delivered: ["returned"],
  cancelled: [],
  returned: [],
};

export const updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { orderStatus: newStatus } = req.body;

  const validStatuses = Object.values(orderStatus);
  if (!validStatuses.includes(newStatus)) {
    return next(new Error("Invalid order status", { cause: 400 }));
  }

  const order = await Order.findById(id);
  if (!order) {
    return next(new Error("Order not found", { cause: 404 }));
  }

  const currentStatus = order.orderStatus;
  const allowed = validTransitions[currentStatus] || [];
  if (!allowed.includes(newStatus)) {
    return next(
      new Error(`Cannot transition from "${currentStatus}" to "${newStatus}"`, {
        cause: 400,
      }),
    );
  }

  order.orderStatus = newStatus;
  await order.save();

  // Send email notification on status change
  const user = await User.findById(order.userId).select("email");
  if (user) {
    orderEvent.emit(
      "orderStatusUpdate",
      user.email,
      order.orderNumber,
      newStatus,
    );
  }

  return res
    .status(200)
    .json({ message: "Order status updated", order: order });
};

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
    sort: bannerFiltersBuilder.sortObject(req.query.sort),
  };

  const filter = bannerFiltersBuilder.filterObject(req.query);

  const banners = await Banner.paginate(filter, options);

  return res.status(200).json({
    message: "Banners fetched successfully",
    banners: banners.docs,
    data: banners,
    total: banners.totalDocs,
    pages: banners.totalPages,
    page: banners.page,
  });
};

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
  const { title, link } = req.body;

  if (!req.file) {
    return next(new Error("Image is required", { cause: 400 }));
  }

  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: `${process.env.CLOUD_NAME}/banners/`,
  });

  const banner = await Banner.create({
    title,
    link,
    image: { secure_url, public_id },
    isActive: true,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    message: "Banner created successfully",
    banner: banner,
  });
};

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
  const { id } = req.params;
  const banner = await Banner.findById(id);

  if (!banner) {
    return next(new Error("Banner not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Banner found",
    banner: banner,
  });
};

/**
 * Update a banner with optional image upload
 *
 * @route PATCH /admin/banners/:id
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - MongoDB banner ID (ObjectId)
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
  const { id } = req.params;
  const { title, link, isActive } = req.body;

  const banner = await Banner.findById(id);
  if (!banner) {
    return next(new Error("Banner not found", { cause: 404 }));
  }

  if (title) banner.title = title;
  if (link) banner.link = link;
  if (isActive !== undefined) banner.isActive = isActive;

  if (req.file) {
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_NAME}/banners`,
      },
    );
    await cloud.uploader.destroy(banner.image.public_id);

    banner.image = { secure_url, public_id };
  }

  await banner.save();

  return res.status(200).json({
    message: "Banner updated successfully",
    banner: banner,
  });
};

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
export const deActivateBanner = async (req, res, next) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true },
  );

  if (!banner) {
    return next(new Error("Banner not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Banner deleted successfully",
  });
};
export const activateBanner = async (req, res, next) => {
  const { id } = req.params;
  const banner = await Banner.findByIdAndUpdate(
    id,
    { isActive: true },
    { new: true },
  );

  if (!banner) {
    return next(new Error("Banner not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Banner activated successfully",
    banner: banner,
  });
};

// --- NEW ENDPOINTS ---

export const getAnalytics = async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const counts = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "seller" }),
    Product.countDocuments(),
    Order.countDocuments(),
  ]);

  const [totalUsers, totalSellers, totalProducts, totalOrders] = counts;

  // Calculate dynamic limit for byDay
  let dailyLimit = 7;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    dailyLimit = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }

  // Revenue analytics
  const revenue = await Order.aggregate([
    { $match: { paymentStatus: "paid", ...dateFilter } },
    {
      $facet: {
        totalRevenue: [
          { $group: { _id: null, total: { $sum: "$totalPrice" } } },
        ],
        byDay: [
          {
            $group: {
              _id: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              total: { $sum: "$totalPrice" },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: dailyLimit },
        ],
        byMonth: [
          {
            $group: {
              _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
              total: { $sum: "$totalPrice" },
            },
          },
          { $sort: { _id: -1 } },
          { $limit: 12 },
        ],
      },
    },
  ]);

  // Top products
  const topProducts = await Order.aggregate([
    { $match: dateFilter },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        title: { $first: "$products.title" },
        soldQuantity: { $sum: "$products.quantity" },
      },
    },
    { $sort: { soldQuantity: -1 } },
    { $limit: 5 },
  ]);

  // Low stock
  const lowStock = await Product.find({
    stock: { $lte: 10 },
    isDeleted: false,
  }).limit(10);

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: "$orderStatus", count: { $sum: 1 } } },
  ]);

  return res.status(200).json({
    message: "Analytics fetched successfully",
    data: {
      counts: { totalUsers, totalSellers, totalProducts, totalOrders },
      revenue: revenue[0],
      topProducts,
      lowStock,
      ordersByStatus,
    },
  });
};

export const getAllSellers = async (req, res, next) => {
  req.query.role = "seller";
  return getAllUsers(req, res, next);
};

export const getSellerById = async (req, res, next) => {
  const { id } = req.params;
  const seller = await User.findOne({ _id: id, role: "seller" });
  if (!seller) return next(new Error("Seller not found", { cause: 404 }));

  const products = await Product.find({ createdBy: id, isDeleted: false });

  return res.status(200).json({
    message: "Seller found",
    data: { seller, products },
  });
};

export const approveSeller = async (req, res, next) => {
  const { id } = req.params;
  const seller = await User.findOneAndUpdate(
    { _id: id, role: "seller" },
    { isBlocked: false },
    { new: true },
  );
  if (!seller) return next(new Error("Seller not found", { cause: 404 }));
  return res.status(200).json({ message: "Seller approved", data: seller });
};

export const restrictSeller = async (req, res, next) => {
  const { id } = req.params;
  const seller = await User.findOneAndUpdate(
    { _id: id, role: "seller" },
    { isBlocked: true },
    { new: true },
  );
  if (!seller) return next(new Error("Seller not found", { cause: 404 }));
  return res.status(200).json({ message: "Seller restricted", data: seller });
};

export const updateUserRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (id === req.user._id.toString()) {
    return next(new Error("You cannot change your own role", { cause: 400 }));
  }

  const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  if (!user) return next(new Error("User not found", { cause: 404 }));

  return res.status(200).json({ message: "User role updated", data: user });
};

// Coupons
export const createCoupon = async (req, res, next) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  return res.status(201).json({ message: "Coupon created", data: coupon });
};

export const getAllCoupons = async (req, res, next) => {
  const { page = 1, limit = 10, isActive } = req.query;
  const filter = {};
  if (isActive !== undefined) filter.isActive = isActive === "true";

  const coupons = await Coupon.paginate(filter, {
    page,
    limit,
    sort: { createdAt: -1 },
  });

  return res.status(200).json({
    message: "Coupons fetched successfully",
    data: coupons,
    total: coupons.totalDocs,
    pages: coupons.totalPages,
    page: coupons.page,
    docs: coupons.docs,
  });
};

export const getCouponById = async (req, res, next) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return next(new Error("Coupon not found", { cause: 404 }));
  return res.status(200).json({ message: "Coupon found", data: coupon });
};

export const updateCoupon = async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!coupon) return next(new Error("Coupon not found", { cause: 404 }));
  return res.status(200).json({ message: "Coupon updated", data: coupon });
};

export const deleteCoupon = async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(
    req.params.id,
    { isActive: false },
    { new: true },
  );
  if (!coupon) return next(new Error("Coupon not found", { cause: 404 }));
  return res.status(200).json({ message: "Coupon soft deleted", data: coupon });
};

// Reviews
export const getAllReviews = async (req, res, next) => {
  const { page = 1, limit = 10, productId, userId, rating } = req.query;
  const filter = {};
  if (productId) filter.productId = productId;
  if (userId) filter.userId = userId;
  if (rating) filter.rating = rating;

  const reviews = await Review.paginate(filter, {
    page,
    limit,
    sort: { createdAt: -1 },
  });

  return res.status(200).json({
    message: "Reviews fetched successfully",
    data: reviews,
    total: reviews.totalDocs,
    pages: reviews.totalPages,
    page: reviews.page,
    docs: reviews.docs,
  });
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { userName, phone, role, addresses, storename, storeDescription } =
    req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  if (id === req.user._id.toString() && role && role !== user.role) {
    return next(new Error("You cannot change your own role", { cause: 400 }));
  }

  if (userName) user.userName = userName;
  if (phone) user.phone = phone;
  if (role) user.role = role;
  if (storename) user.storename = storename;
  if (storeDescription) user.storeDescription = storeDescription;
  if (addresses) {
    // Map phone from payload to country if needed, or just pass as is if schema allows
    // Based on schema analysis, address has street, city, country, postalCode
    // We'll keep street, city, postalCode and ignore phone or use it as country if appropriate
    user.address = addresses.map((addr) => ({
      street: addr.street,
      city: addr.city,
      country: addr.country || "", // Provide empty string if missing
      postalCode: addr.postalCode,
    }));
  }

  await user.save();

  return res.status(200).json({
    message: "user updated successfully",
    data: user,
  });
};

export const updateUserImage = async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    return next(new Error("user not found", { cause: 404 }));
  }

  if (!req.file) {
    return next(new Error("image is required", { cause: 400 }));
  }

  const folderPath = `${process.env.CLOUD_NAME}/user/${id}/profile`;
  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: folderPath,
  });

  if (user.profilePicture && user.profilePicture.public_id) {
    await cloud.uploader.destroy(user.profilePicture.public_id);
  }

  user.profilePicture = { secure_url, public_id };
  await user.save();

  return res.status(200).json({
    message: "user image updated successfully",
    data: user,
  });
};
