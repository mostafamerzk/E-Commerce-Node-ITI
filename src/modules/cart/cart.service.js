import { Cart } from "../../DB/Models/cart.js"
import { Product } from "../../DB/Models/product.js"

export const getCartItems = async (req, res)=>{
    const cart = await Cart.findOne({userId:req.user._id})
    if(cart){
        res.status(200).json({
            "message": "Cart fetched successfully",
            "cart": cart
        })
    } else{
        res.status(400).json({
            "message": "Cart Not Found",
        })
    }
}

export const addCartItem = async (req, res) => {
    const { productId, quantity=1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({
        userId: req.user._id
    });

    if (!cart) {
        cart = await Cart.create({
            userId: req.user._id,
            products: [{
                productId,
                quantity
            }],
            totalPrice: product.price * quantity
        });

        return res.status(200).json({
            message: "Item added to cart",
            cart
        });
    }

    const existingItem = cart.products.find(
        item => item.productId.toString() === productId
    );

    if (existingItem) {
        return res.status(409).json({
            message: "Product already in cart. Use PATCH to update quantity."
        });
    }

    if (product.stock < quantity) {
        return res.status(400).json({
            message: "Not enough stock"
        });
    }

    cart.products.push({ productId, quantity });
    cart.totalPrice += product.price * quantity;
    await cart.save();

    res.status(200).json({
        message: "Item added to cart",
        cart
    });
};


// PATCH /cart/:productId
export const updateCartItemQuantity = async (req, res) => {
    const { productId } = req.params;
    const { quantity } = req.body; // new absolute quantity

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        return res.status(404).json({
            message: "Cart not found"
        });
    }

    const item = cart.products.find(
        item => item.productId.toString() === productId
    );

    if (!item) {
        return res.status(404).json({
            message: "Product not in cart"
        });
    }

    // Validate stock
    if (quantity > product.stock) {
        return res.status(400).json({
            message: "Not enough stock"
        });
    }

    // Calculate price difference
    const quantityDifference = quantity - item.quantity;
    item.quantity = quantity;
    cart.totalPrice += product.price * quantityDifference;

    await cart.save();

    res.status(200).json({
        message: "Cart updated",
        cart
    });
};

export const removeCartItem = async (req, res) => {
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.find(
        item => item.productId.toString() === productId
    );

    if (!item) {
        return res.status(404).json({
            message: "Product not in cart"
        });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    cart.totalPrice -= item.quantity * product.price;

    cart.products = cart.products.filter(
        item => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
        message: "Item removed from cart",
        cart
    });
};

export const clearCart = async (req, res) => {
    const cart = await Cart.findOne({ userId: req.user._id });

    if (!cart) {
        return res.status(404).json({
            message: "Cart not found"
        });
    }

    cart.products = [];
    cart.totalPrice = 0;

    await cart.save();

    res.status(200).json({
        message: "Cart cleared successfully"
    });
};
