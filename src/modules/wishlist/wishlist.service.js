import { User } from "../../DB/Models/user.js"
import { Product } from "../../DB/Models/product.js"

export const getwishlist=async(req,res)=>{

    const data=await User.findById(req.user._id).populate({  path: "wishlist",
        select: "_id title price mainImage"})
    res.status(201).json(data.wishlist)

}

export const postwishlist=async(req,res)=>{
    let data=req.user.wishlist
    if(data.length){
    const chk=data.find((ele)=>ele==req.params.productId)
    if(chk)
        return res.status(404).json("already exist")
}
    data.push(req.params.productId)
    data=await User.findByIdAndUpdate(req.user._id,{wishlist:data},{new:true})
        res.status(201).json({
            "message": "Product added to wishlist",
            "wishlist": data.wishlist
          })
}

export const deletewishlist=async(req,res)=>{
    let data=req.user.wishlist
    const chk=data.find((ele)=>ele==req.params.productId)
    if(!chk)
        return res.status(404).json("not exist")
    data= data.filter(ele=>(ele!=req.params.productId))
    data=await User.findByIdAndUpdate(req.user._id,{wishlist:data},{new:true})
    res.status(201).json({
        "message": "Product removed from wishlist",
        "wishlist": data.wishlist
      })
}