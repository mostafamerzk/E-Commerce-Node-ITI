import { Category } from "../../DB/Models/category.js";
import { cloud } from "../../utils/multer/cloud.config.js";
import { asyncHandler } from "../../utils/error handling/asyncHandler.js";
import { isValidObjectId } from "../../middleware/validation.middleware.js";
import slugify from "slugify";

export const createCategory = asyncHandler(async (req, res, next) => {
  const { name, parentCategoryId } = req.body;

  // Check unique name
  if (await Category.findOne({ name })) {
    return next(new Error("Category name already exists", { cause: 409 }));
  }

  // Upload image
  if (!req.file) {
    return next(new Error("Category image is required", { cause: 400 }));
  }

  const { secure_url, public_id } = await cloud.uploader.upload(req.file.path, {
    folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
  });

  const category = await Category.create({
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
  const categories = await Category.find().populate([
    { path: "createdBy", select: "userName email" },
    { path: "parentCategoryId", select: "name slug" },
  ]);
  return res.status(200).json({
    message: "Categories fetched successfully",
    categories,
  });
});

export const getCategory = asyncHandler(async (req, res, next) => {
  const { categoryId } = req.params;

  // Hybrid approach: Search by ID if valid, otherwise search by slug
  let query = {};
  if (categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    query = { _id: categoryId };
  } else {
    query = { slug: categoryId };
  }

  const category = await Category.findOne(query).populate([
    { path: "createdBy", select: "userName email" },
    { path: "parentCategoryId", select: "name slug" },
  ]);

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

  // Update name and handle slug shift
  if (name) {
    if (name !== category.name) {
      if (await Category.findOne({ name })) {
        return next(new Error("Category name already exists", { cause: 409 }));
      }
      category.name = name;
      // Slug will be updated by pre-save hook
    }
  }

  if (parentCategoryId) {
    category.parentCategoryId = parentCategoryId;
  }

  // Update image
  if (req.file) {
    // Delete old image
    await cloud.uploader.destroy(category.image.public_id);
    // Upload new image
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
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
  await cloud.uploader.destroy(category.image.public_id);

  // Delete from DB
  await Category.findByIdAndDelete(categoryId);

  return res.status(200).json({
    message: "Category deleted successfully",
  });
});
