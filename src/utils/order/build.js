/**
 * this module requires mongoose and mongoose-paginate-v2 to define the order schema and enable pagination functionality.
 * 
 * @description This module provides utility functions for building sorting and filtering objects for order queries.
 * It includes functions to convert query parameters into MongoDB-compatible sorting and filtering objects.
 * These functions are used in the admin service to retrieve orders based on various criteria.
 * @param {*} sortParam 
 * @constant {const options = {page: req.query.page || 1,limit: req.query.limit || 10,sort: builder.sortObject(req.query.sort)}}
 * @returns 
 * build a sorting object inside the options object for pagination based on the sort query parameter provided in the request.
 * then build a filter object and give it the req.query as a parameter to filter the orders based on the query parameters provided in the request.
 * @example
 * // Request: GET {{base}}/?sort=newest&status=pending&minTotal=500
 * // Response: { message: "all orders", data: { docs: [...], totalDocs: 50, ... } }
 */

export const sortObject = (sortParam) => {
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        totalHigh: { totalAmount: -1 },
        totalLow: { totalAmount: 1 },
        orderStatus: { status: 1 }
    };

    return sortOptions[sortParam] || { createdAt: -1 };
};

export const filterObject = (query) => {
    const filter = {};

    if (query.status) filter.orderStatus = query.status;
    if (query.userId) filter.userId = query.userId;
    
    if (query.minTotal || query.maxTotal) {
        filter.totalPrice = {};
        if (query.minTotal) filter.totalPrice.$gte = Number(query.minTotal);
        if (query.maxTotal) filter.totalPrice.$lte = Number(query.maxTotal);
    }
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if(query.paymentMethod) filter.paymentMethod = query.paymentMethod;
    
    if (query.startDate || query.endDate) {
        filter.createdAt = {};
        if (query.startDate) filter.createdAt.$gte = new Date(query.startDate);
        if (query.endDate) filter.createdAt.$lte = new Date(query.endDate);
    }

    return filter;
};
