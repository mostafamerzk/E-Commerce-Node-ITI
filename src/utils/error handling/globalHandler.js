export const globalHandler = (error, req, res, next) => {
  const status = error.cause || 500;

  return (pross.env.NODE_ENV != 'production')? 
    res.status(status).json({ message: error.message, stack: error.stack }):
    res.status(status).json({ message: error.message});
};
