import { User } from "../../DB/Models/user.js"
import { Product } from "../../DB/Models/product.js"

export const getwishlist = async (req, res) => {
  const data = await User.findById(req.user._id).populate({
    path: "wishlist",
    select: "_id title price mainImage finalPrice discount avgRating"
  });

  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({
    message: "Wishlist fetched successfully",
    wishlist: data.wishlist ?? []
  });
};
export const postwishlist = async (req, res) => {
    try {
      const { productId } = req.params;
  
      const productExists = await Product.exists({ _id: productId });
      if (!productExists) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const alreadyExists = user.wishlist.some(
        (id) => id.toString() === productId
      );
  
      if (alreadyExists) {
        return res.status(409).json({ message: "already exist" });
      }
  
      user.wishlist.push(productId);
      await user.save();
  
      return res.status(201).json({
        message: "Product added to wishlist",
        wishlist: user.wishlist,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Server error",
        error: error.message,
      });
    }
  
};

export const deletewishlist=async(req,res)=>{
    const { productId } = req.params;

    
let user = await User.findById(req.user._id);

if (!user) {
  return res.status(404).json({ message: "User not found" });
}
const {wishlist}=user
const chk=wishlist.find((ele)=>ele.toString()==productId)

if(!chk)
  return res.status(404).json({ message: "product not exist" });
const removed=wishlist.filter((ele)=>ele.toString()!=productId)

let del = await User.findByIdAndUpdate(req.user._id,{wishlist:removed},{new:true});
//console.log(del)

if(del)
res.status(200).json({
  message: "Product removed from wishlist",
  wishlist: del.wishlist
});
}