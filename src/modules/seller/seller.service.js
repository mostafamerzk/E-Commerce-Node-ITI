import { Product } from "../../DB/Models/product.js";
import { User } from "../../DB/Models/user.js";
import { Order } from "../../DB/Models/order.js";


export const upsertSellerProfileService = async (req, res) => {
  const { storename, phone, storeDescription } = req.body;

  const user = await User.findById(req.user._id);

  if (!user)
    return res.status(404).json({ message: "User not found" });

  if (user.role === "seller")
    return res.status(400).json({ message: "Already seller" });

  user.storename = storename;
  user.phone = phone;
  user.storeDescription = storeDescription;
  //user.storeImage = storeImage;

  user.role = "seller";

  await user.save();

  res.status(200).json({
    message: "Seller profile updated",
  user
  });
};


export const getSellerProfileService = async (req, res) => {
  try {
    const seller = await User.findById(req.user._id)
if(seller.role!="seller")
  return res.status(404).json({ message: "you should be seller" });

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
    let seller = await User.findOne({ _id: req.user._id,role:"seller" });
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

export const getSellerInventoryService = async (req, res) => {
  try {
    const userId = req.user._id;

    const products = await Product.find({ createdBy: userId }).select(
      "title stock"
    );

    const soldData = await Order.aggregate([
      {
        $match: {
          sellerId: userId,
          orderStatus: { $in: [orderStatus.completed, orderStatus.pending] }
        }
      },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.productId",
          sold: { $sum: "$products.quantity" }
        }
      }
    ]);

    const soldMap = {};
    soldData.forEach(item => {
      soldMap[item._id.toString()] = item.sold;
    });

    const inventory = products.map(p => ({
      productId: p._id,
      title: p.title,
      stock: p.stock || 0,
      sold: soldMap[p._id.toString()] || 0
    }));

    return res.status(200).json({
      message: "Inventory fetched successfully",
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