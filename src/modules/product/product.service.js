import slugify from "slugify";
import { Product } from "../../DB/Models/product.js";
import { cloud } from "../../utils/multer/cloud.config.js";
import { Review } from "../../DB/Models/review.js";

export const createProduct = async (req, res) => {
  const {
    title,
    description,
    price,
    discount = 0,
    stock,
    categoryId
  } = req.body;

  if (!req.files?.mainImage) {
    return res.status(400).json({
      message: "Main image is required"
    });
  }

  const slug = slugify(title, { lower: true });

  let product=undefined;
  try {
    product = await Product.create({
        title,
        slug,
        description,
        price,
        discount,
        stock,
        categoryId,
        createdBy: req.user._id
    });
    const folderPath = `${process.env.CLOUD_NAME}/products/${product.slug}-${product._id}`;

    const mainUpload = await cloud.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `${folderPath}/main` }
    );
    let images = [];
    if (req.files?.subImages) {
        const uploads = await Promise.all(
        req.files.subImages.map(file =>
            cloud.uploader.upload(file.path, {
            folder: `${folderPath}/gallery`
            })
        )
        );
        images = uploads.map(img => ({
            secure_url: img.secure_url,
            public_id: img.public_id
        }));
    }
    product.mainImage = {
        secure_url: mainUpload.secure_url,
        public_id: mainUpload.public_id
    };

    product.images = images;

    await product.save();
  } catch (error) {
    if (product?._id) {
        await Product.findByIdAndDelete(product._id);
    }
    if (product?.mainImage?.public_id) {
        await cloud.uploader.destroy(product.mainImage.public_id);
    }
    throw error;
  }
  res.status(201).json({
    message: "Product created successfully",
    product
  });
};

export const getAllProducts = async (req, res) => {
  const {
    search,
    minPrice,
    maxPrice,
    categoryId,
    sort,
    page = 1,
    limit = 10
  } = req.query;

  const filter = { isDeleted: false };

  if (search) {
    filter.title = { $regex: search, $options: "i" };
  }
  if (minPrice || maxPrice) {
    filter.finalPrice = {};
    if (minPrice) filter.finalPrice.$gte = Number(minPrice);
    if (maxPrice) filter.finalPrice.$lte = Number(maxPrice);
  }
  if (categoryId) {
    filter.categoryId = categoryId;
  }
  const pageNumber = Number(page) || 1;
  const limitNumber = Number(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const totalItems = await Product.countDocuments(filter);
  const products = await Product.find(filter)
  .sort(sort || "-createdAt")
  .skip(skip)
  .limit(limitNumber);

  const totalPages = Math.ceil(totalItems / limitNumber);

  res.status(200).json({
    message: "Products fetched successfully",
    products:products,
    pagination: {
      currentPage: Number(page),
      totalPages,
      totalItems
    }
  });
};


export const getSingleProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  }).lean();

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  const reviewsPreview = await Review.find({ productId })
  .sort({ createdAt: -1 })
  .limit(3);

  product.reviews = reviewsPreview;

  res.status(200).json({
    message: "Product fetched successfully",
    product
  });
};

export const updateProduct = async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  // Ownership check
  if (
    product.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Not authorized"
    });
  }

  const updates = req.body;

  Object.assign(product, updates);

  // If new images uploaded
  if (req.files?.mainImage) {
    if (product.mainImage?.public_id) {
        await cloud.uploader.destroy(product.mainImage.public_id);
    }
    const uploaded = await cloud.uploader.upload(
        req.files.mainImage[0].path,
        { folder: `products/${product.slug}-${product._id}/main` }
    );

    product.mainImage = {
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id
    };
  }

  if (req.files?.subImages) {
    if (product.images?.length) {
        await Promise.all(
        product.images.map(img =>
            cloud.uploader.destroy(img.public_id)
        )
        );
    }

    const uploads = await Promise.all(
        req.files.subImages.map(file =>
        cloud.uploader.upload(file.path, {
            folder: `products/${product.slug}-${product._id}/gallery`
        })
        )
    );

    // 🔹 save new images
    product.images = uploads.map(img => ({
        secure_url: img.secure_url,
        public_id: img.public_id
    }));
  }

  await product.save();
  res.status(200).json({
    message: "Product updated successfully",
    product
  });
};

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
    isDeleted: false
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  if (
    product.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      message: "Not authorized"
    });
  }

  product.isDeleted = true;
  await product.save();

  res.status(200).json({
    message: "Product deleted successfully"
  });
};
