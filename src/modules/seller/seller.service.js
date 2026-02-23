import { Product } from "../../DB/Models/product.js";
import { User } from "../../DB/Models/user.js";
import { Order } from "../../DB/Models/order.js";
import { orderStatus } from "../../utils/enums/enums.js";

export const upsertSellerProfileService = async (req, res) => {
  const { storename, phone, storeDescription } = req.body;

  const user = await User.findById(req.user._id);

  if (!user)
    return res.status(404).json({ message: "User not found" });

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
    const sellerId = req.user._id; // البائع الحالي

    const inventory = await Product.aggregate([
      // 1️⃣ جلب المنتجات الخاصة بالبائع
      { $match: { sellerId } },

      // 2️⃣ جلب المبيعات من الـ Orders
      {
        $lookup: {
          from: "orders",
          let: { productId: "$_id" },
          pipeline: [
            { $unwind: "$products" }, // نفك الـ array
            {
              $match: {
                $expr: { $eq: ["$products.productId", "$$productId"] },
                orderStatus: { $in: [orderStatus.completed, orderStatus.pending] }
              }
            },
            {
              $group: {
                _id: "$products.productId",
                sold: { $sum: "$products.quantity" }
              }
            }
          ],
          as: "sales"
        }
      },

      // 3️⃣ لو مفيش مبيعات → sold = 0
      {
        $addFields: {
          sold: { $ifNull: [{ $arrayElemAt: ["$sales.sold", 0] }, 0] }
        }
      },

      // 4️⃣ مشروع الحقول المطلوبة فقط
      {
        $project: {
          productId: "$_id",
          title: 1,
          stock: { $ifNull: ["$stock", 0] },
          sold: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({ inventory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};