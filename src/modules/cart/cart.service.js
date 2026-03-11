import { Cart } from "../../DB/Models/cart.js";
import { Product } from "../../DB/Models/product.js";

export const getCartItems = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(200).json({ // ✅ 200 مش 400
      message: "Cart is empty",
      cart: { products: [] },
    });
  }
  await cart.populate({
    path: "products.productId",
    model: "Products",
    match: {
      isDeleted: { $ne: true },
      stock: { $gt: 0 },
    },
  });
  const finalCart = cart.toObject();
  finalCart.products = finalCart.products
    .filter((item) => item.productId !== null)
    .map((item) => ({
      product: item.productId,
      quantity: item.quantity,
    }));
  res.status(200).json({
    message: "Cart fetched successfully",
    cart: finalCart,
  });
};

export const addCartItem = async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    return res.status(404).json({ message: "Product not found" });
  }
  if (product.stock < quantity) {
    return res.status(400).json({
      message: "Not enough stock",
    });
  }

  let cart = await Cart.findOne({
    userId: req.user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      products: [
        {
          productId,
          quantity,
        },
      ],
    });

    return res.status(200).json({
      message: "Item added to cart",
      cart,
    });
  }

  const existingItem = cart.products.find((item) =>
    item.productId.equals(productId),
  );

  if (existingItem) {
    return res.status(409).json({
      message: "Product already in cart. Use PATCH to update quantity.",
    });
  }

  cart.products.push({ productId, quantity });
  await cart.save();

  res.status(200).json({
    message: "Item added to cart",
    cart,
  });
};

// PATCH /cart/:productId
export const updateCartItemQuantity = async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body; // new absolute quantity

  const product = await Product.findById(productId);
  if (!product || product.isDeleted) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  const item = cart.products.find((item) => item.productId.equals(productId));

  if (!item) {
    return res.status(404).json({
      message: "Product not in cart",
    });
  }

  // Validate stock
  if (quantity > product.stock) {
    return res.status(400).json({
      message: "Not enough stock",
    });
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("products.productId"); // ← add this

  res.status(200).json({
    message: "Cart updated",
    cart,
  });
};

export const removeCartItem = async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const initialLength = cart.products.length;

  cart.products = cart.products.filter(
    (item) => !item.productId.equals(productId),
  );

  if (cart.products.length === initialLength) {
    return res.status(404).json({
      message: "Product not in cart",
    });
  }

  await cart.save();

  res.status(200).json({
    message: "Item removed from cart",
    cart: cart,
  });
};

export const clearCart = async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user._id });

  if (!cart) {
    return res.status(404).json({
      message: "Cart not found",
    });
  }

  cart.products = [];

  await cart.save();

  res.status(200).json({
    message: "Cart cleared successfully",
  });
};
