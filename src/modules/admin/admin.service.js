import {User} from "../../DB/Models/user.js";
import {Product} from "../../DB/Models/product.js";
import * as builder from "../../utils/product/build.js";
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
export const getAllUsers = async (req, res) => {
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
export const getUserById = async (req, res) => {
    const {id} = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({message:"user not found"}) 
    }   
    return res.status(200).json({message:"user found",data:user})
}

/**
 * Retrieve a single user by their email address
 * 
 * @route GET /admin/users/:email
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.email - User email address (case-insensitive due to schema)
 * @param {Object} res - Express response object
 * @returns {Object} User document with all fields
 * @returns {string} returns.message - Success or error message
 * @returns {Object} returns.data - User object (only if found)
 * @status {200} Success - User found and returned
 * @status {404} Not Found - User with given email does not exist
 * @example
 * // Request: GET /admin/users/alice@example.com
 * // Response: { message: "user found", data: { _id: "...", userName: "alice123", email: "alice@example.com", ... } }
 * // Error: { message: "user not found" }
 */
export const getUserbyEmail = async (req, res) => {
    const {email} = req.params;
    const user = await User.findOne({email});
    if (!user) {
        return res.status(404).json({message:"user not found"}) 
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
export const restrictUser = async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,{isDeleted:true},{new:true});
    if (!user) {
        return res.status(404).json({message:"user not found"}) 
    }   
    return res.status(200).json({message:"user restricted",data:user})
}
/**
 * Approve/un-restrict a user by setting isDeleted flag to false
 * This restores access to the user's account if they were previously restricted
 * @route PATCH /admin/users/:userId/approve
 */

export const approveUser = async (req, res) => {
    const {id} = req.params;
    const user = await User.findByIdAndUpdate(id,{isDeleted:false},{new:true});
    if (!user) {
        return res.status(404).json({message:"user not found"}) 
    }   
    return res.status(200).json({message:"user approved",data:user})
}

export const getAllProducts = async (req, res) => {
    const options = {
        page: req.query.page || 1,
        limit: req.query.limit || 10,
        sort: builder.sortObject(req.query.sort)
    };


    const filter = builder.filterObject(req.query);

    const products = await Product.paginate(filter, options);

    return res.status(200).json({
        message: "all products",    
        data: products
    });
}

export const getProductById = async (req, res) => { 
    const {id} = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({message:"product not found"}) 
    }
    return res.status(200).json({message:"product found",data:product})
}

export const deleteProduct = async (req, res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    console.log(product);
    if (!product) {
        return res.status(404).json({message:"product not found"}) 
    }
    return res.status(200).json({message:"product deleted",data:product})
}