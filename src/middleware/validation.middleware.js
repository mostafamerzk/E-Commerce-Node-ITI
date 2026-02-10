import { Types } from "mongoose";

export const validation = (schema)=>{
    return (req,res,next)=>{
        //data 
        const data = {...req.query,...req.params,...req.body};
        // validate the data (compare)
        if(req.file||req.files?.length){
            data.file = req.file ||req.files;
        }
        const results = schema.validate(data,{abortEarly: false})
        // errors
        if (results.error){
            const messageList = results.error.details.map((obj)=>obj.message);
            return next(new Error(messageList,{cause:400}))
        } 
        return next();
    }
};
    // for joi.custom(value,helper) 
export const isValidObjectId = (value,helper)=>{
    if (!Types.ObjectId.isValid(value))
        return helper.message("in valid id")
    return true;
};