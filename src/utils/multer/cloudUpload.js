import multer,{diskStorage} from "multer";

export const fileValidations={
    Image : ['jpg', 'jpeg', 'png', 'gif'],
    Document : ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
}
export const uploadCloud = (extensions=fileValidations.Image)=>{
    const storage = diskStorage({})
    const fileFilter =(req,file,cb)=>{
        const fileMimeType = file.originalname.split(".").pop().toLowerCase()
        if(extensions.includes(fileMimeType))
            return cb(null,true)
        return cb("invalid extension",false)
    }
    return  multer({storage:storage,fileFilter});
}