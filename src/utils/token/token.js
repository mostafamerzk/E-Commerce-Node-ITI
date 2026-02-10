import jwt from 'jsonwebtoken';

export const generateToken =({payload, secret=process.env.JWT_SECRET|| "secretKey",options={}})=>{
    
return jwt.sign(payload,secret,options)
};

export const verifyToken=({token,secret=process.env.JWT_SECRET|| "secretKey",options={}})=>{
    return jwt.verify(token,secret,options)
};