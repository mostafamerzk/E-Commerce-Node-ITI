/**
 * this module requires mongoose and mongoose-paginate-v2 to define the banner schema and enable pagination functionality.
 * 
 * @description This module provides utility functions for building sorting and filtering objects for banner queries.
 * It includes functions to convert query parameters into MongoDB-compatible sorting and filtering objects.
 * These functions are used in the admin service to retrieve banners based on various criteria.
 * @param {*} sortParam 
 * @constant {const options = {page: req.query.page || 1,limit: req.query.limit || 10,sort: builder.sortObject(req.query.sort)}}
 * @returns 
 * build a sorting object inside the options object for pagination based on the sort query parameter provided in the request.
 * then build a filter object and give it the req.query as a parameter to filter the banners based on the query parameters provided in the request.
 * @example
 * // Request: GET {{base}}/?sort=newest&isActive=true
 * // Response: { message: "all banners", data: { docs: [...], totalDocs: 50, ... } }
 */

export const sortObject = (sortParam) => {
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        title: { title: 1 }
    };

    return sortOptions[sortParam] || { createdAt: -1 };
};

export const filterObject = (query) => {
    const filter = {};

    if (query.isActive !== undefined) filter.isActive = query.isActive === "true";
    if (query.title) filter.title = { $regex: query.title, $options: "i" };
    
    return filter;
};
