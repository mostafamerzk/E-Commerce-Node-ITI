export const globalHandler = (error, req, res, next) => {
  const status = error.cause || 500;
  return res
    .status(status)
    .json({ message: error.message, stack: error.stack });
};
