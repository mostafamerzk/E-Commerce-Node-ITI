/**
 * This module provides utility functions for building sorting and filtering objects for user queries.
 * It includes functions to convert query parameters into MongoDB-compatible sorting and filtering objects.
 * These functions are used in the user service to retrieve users based on various criteria.
 * 
 * @description Utility functions for user filtering and sorting
 * @example
 * // Request: GET {{base}}/users?sort=newest&role=seller&country=USA&search=John
 * // Response: { message: "all users", data: { docs: [...], totalDocs: 50, ... } }
 */

export const sortObject = (sortParam) => {
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        byRole: { role: 1 },
        byName: { userName: 1 },
    };

    return sortOptions[sortParam] || { createdAt: -1 };
};

export const filterObject = (query) => {
    const filter = {};

    if (query.role) filter.role = query.role;
    if (query.isDeleted !== undefined) filter.isDeleted = query.isDeleted === "true";
    if (query.isLogged !== undefined) filter.isLogged = query.isLogged === "true";
    
    // Search by userName or storename
    if (query.search) {
        filter.$or = [
            { userName: { $regex: query.search, $options: "i" } },
            { storename: { $regex: query.search, $options: "i" } }
        ];
    }
    
    // Filter by address (country and city)
    if (query.country || query.city) {
        const addressMatch = {};
        if (query.country) addressMatch.country = query.country;
        if (query.city) addressMatch.city = query.city;
        filter.address = { $elemMatch: addressMatch };
    }

    return filter;
};
