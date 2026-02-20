import { User } from '../DB/Models/user.js';
import { verifyToken } from '../utils/token/token.js';

const ALLOWED_PATHS = ['/profile/sendOtp', '/profile/verifyOtp'];

export const isAuthenticated = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    // Validate Authorization Header
    if (!authorization) {
      return next(new Error('Authorization header required'));
    }

    const [bearer, token] = authorization.split(' ');
    if (bearer !== 'Bearer' || !token) {
      console.log(token)
      return next(new Error('Invalid token format'));
    }

    // Verify and Decode Token
    const decoded = verifyToken({ token });
    
    if (!decoded.id) {
      return next(new Error('Invalid token'));
    }

    // Fetch User from Database
    const user = await User.findById(decoded.id)
      .select('-password')
      .lean();
    if (!user) {
      return next(new Error('User not found'));
    }

    // Check Account Status
    if (user.isDeleted) {
      if (!ALLOWED_PATHS.some(path => req.originalUrl.includes(path))) {
        return next(new Error('Account frozen. Please reactivate.'));
      }
    }

    // Validate Token Freshness
    const tokenIssuedAt = decoded.iat * 1000; // Convert to milliseconds
    if (user.passwordChangeTime?.getTime() > tokenIssuedAt) {
      if (!ALLOWED_PATHS.some(path => req.originalUrl.startsWith(path))) {
        return next(new Error('Session expired. Please login.'));
      }
    }
    // check if the user logged
    // if (!user.isLogged) {
    //   return next(new Error('Please login.'));
    //   }

    // Attach User to Request
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};