export const sortObject = (sortParam) => {
    const sortOptions = {
        newest: { createdAt: -1 },
        oldest: { createdAt: 1 },
        ratingHigh: { rating: -1 },
        ratingLow: { rating: 1 }
    };

    return sortOptions[sortParam] || { createdAt: -1 };
};
export const filterObject = (query,params) => {
    const filter = {};
    if(params.productId){
        filter.productId = params.productId;
    }
    if (query.minRating || query.maxRating) {
        filter.rating = {};
        if (query.minRating) filter.rating.$gte = Number(query.minRating);
        if (query.maxRating) filter.rating.$lte = Number(query.maxRating);
    }

    if (query.rating) filter.rating = { $gte: Number(query.rating) };

    return filter;
};