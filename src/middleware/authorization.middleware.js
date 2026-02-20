export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user.role);

    if (!roles.includes(req.user.role))
      return next(new Error("Not Authorized!", { cause: 401 }));
    return next();
  };
};
