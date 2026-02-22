/**
 * this  module requires mongoose and mongoose-paginate-v2 to define the product schema and enable pagination functionality.
 * 
 * @description This module provides utility functions for building sorting and filtering objects for product queries.
 * It includes functions to convert query parameters into MongoDB-compatible sorting and filtering objects.
 * These functions are used in the admin service to retrieve products based on various criteria.
 * @param {*} sortParam 
 * @constant {const options = {page: req.query.page || 1,limit: req.query.limit || 10,sort: builder.sortObject(req.query.sort)}}
 * @returns 
 * build a sorting object inside the options object for pagination based on the sort query parameter provided in the request.
 * then bulid a filter object and give it the req.query as a parameter to filter the products based on the query parameters provided in the request.
 * @example
 * // Request: GET {{base}}/?sort=priceHigh&category=electronics&minPrice=100
 * // Response: { message: "all products", data: { docs: [...], totalDocs: 50, ... } }
 */

export const sortObject = (sortParam) => {
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        priceHigh: { price: -1 },
        priceLow: { price: 1 },
        rating: { rating: -1 }
    };

    return sortOptions[sortParam] || { createdAt: -1 };
};
export const filterObject = (query) => {
    const filter = {};

    if (query.category) filter.category = query.category;    
    if (query.minPrice || query.maxPrice) {
        filter.price = {};
        if (query.minPrice) filter.price.$gte = Number(query.minPrice);
        if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
    }
    if (query.rating) filter.rating = { $gte: Number(query.rating) };
    if (query.inStock !== undefined) filter.inStock = query.inStock === "true";
    if (query.search) {
        filter.$text = {$search: query.search};
    }

    return filter;
};