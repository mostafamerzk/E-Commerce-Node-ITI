export const asyncHandler = (fn)=>{
    return (req,res,next)=>{
        fn(req,res,next).catch((err)=>{
            // this part to handle mongoose functions error like the one from create() 
            if(Object.keys(err)==0)
                return next(new Error(err.message))
            return next(err)})
    }
};
