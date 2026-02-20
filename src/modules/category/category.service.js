import { Category } from "../../DB/Models/category.js";
import { cloud } from "../../utils/multer/cloud.config.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import mongoose from "mongoose";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, parentCategoryId } = req.body;

  // Check unique name
  if (await Category.findOne({ name })) {
    return next(new Error("Category name already exists", { cause: 409 }));
  }

  const categoryId = new mongoose.Types.ObjectId();
  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: `${process.env.CLOUD_NAME}/category/${categoryId}`,
  });

  const category = await Category.create({
    _id: categoryId,
    name,
    parentCategoryId: parentCategoryId || null,
    image: { secure_url, public_id },
    createdBy: req.user._id,
  });

  return res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

export const getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find().lean();
  return res.status(200).json({
    message: "Categories fetched successfully",
    categories,
  });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId).lean();

  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  return res.status(200).json({
    message: "Category fetched successfully",
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;
  const { name, parentCategoryId } = req.body;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  // Update name
  if (name) {
    if (name !== category.name) {
      if (await Category.findOne({ name })) {
        return next(new Error("Category name already exists", { cause: 409 }));
      }
      category.name = name;
    }
  }

  if (parentCategoryId) {
    category.parentCategoryId = parentCategoryId;
  }

  // Update image
  if (req.file) {
    // Delete old image
    if (category.image.public_id) {
      await cloud.uploader.destroy(category.image.public_id);
    }
    // Upload new image
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_NAME}/category/${categoryId}`,
      },
    );
    category.image = { secure_url, public_id };
  }

  await category.save();

  return res.status(200).json({
    message: "Category updated successfully",
    category,
  });
});

export const deleteCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new Error("Category not found", { cause: 404 }));
  }

  // Delete from Cloudinary
  if (category.image.public_id) {
    await cloud.uploader.destroy(category.image.public_id);
  }

  // Delete from DB
  await Category.findByIdAndDelete(categoryId);

  return res.status(200).json({
    message: "Category deleted successfully",
  });
});
