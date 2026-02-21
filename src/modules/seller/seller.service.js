import { Product } from "../../DB/Models/product.js";
import { User } from "../../DB/Models/user.js";


export const upsertSellerProfileService = async (req, res) => {
  try {
    const { storeName, phone, storeDescription, storeImage } = req.body;

    let seller = await User.findOne({ userId: req.user._id });
    if (seller) {
      seller.storeName = storeName ?? seller.storeName;
      seller.phone = phone ?? seller.phone;
      seller.storeDescription = storeDescription ?? seller.storeDescription;
      seller.storeImage = storeImage ?? seller.storeImage;

      await User.save();
    } else {
      seller = await User.create({
        userId: req.user._id,
        storeName,
        phone,
        storeDescription,
        storeImage
      });
      await User.findByIdAndUpdate(req.user._id,{role:"seller"},{new:true})

    }

    return res.status(200).json({
      message: "Seller profile updated",
      user: seller
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


export const getSellerProfileService = async (req, res) => {
  try {
    const seller = await Seller.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email phone"
    );

    if (!seller) {
      return res.status(404).json({ message: "Seller profile not found" });
    }

    return res.status(200).json({
      message: "Profile fetched",
      user: seller
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};


export const getSellerProductsService = async (req, res) => {
  try {
    let seller = await Seller.findOne({ userId: req.user._id });
if(!seller)
  return res.status(404).json("seller not found")

    const products = await Product.find({ createdBy: req.user._id });

    return res.status(200).json({
      message: "Seller products fetched",
      products
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};

/**
 * GET /seller/inventory
 * نظرة عامة على المخزون لكل المنتجات
 */
export const getSellerInventoryService = async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).select(
      "name stock sold"
    );

    const inventory = products.map((p) => ({
      productId: p._id,
      title: p.name,
      stock: p.stock || 0,
      sold: p.sold || 0
    }));

    return res.status(200).json({
      message: "Inventory fetched",
      inventory
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message
    });
  }
};