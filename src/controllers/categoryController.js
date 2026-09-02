import prisma from "../config/prisma.js";

// GET /api/categories - Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { events: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/categories/:id - Get single category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        events: true,
      },
    });

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    return res.status(200).json({ success: true, data: category });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/categories - Create new category (Protected: ADMIN)
export const createCategory = async (req, res) => {
  try {
    const { name, slug } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // Generate fallback slug if not provided
    const formattedSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

    // Check if either name or slug already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ name: name.trim() }, { slug: formattedSlug }],
      },
    });

    if (existingCategory) {
      const conflictField =
        existingCategory.name === name.trim() ? "Name" : "Slug";
      return res.status(409).json({
        success: false,
        message: `Category ${conflictField} already exists`,
      });
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: formattedSlug,
      },
    });

    return res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Category ${error.meta?.target?.[0] || "field"} already exists`,
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/categories/:id - Update category (Protected: ADMIN)
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug } = req.body;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (slug) {
      updateData.slug = slug;
    } else if (name) {
      updateData.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({ success: true, data: updatedCategory });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({
        success: false,
        message: `Category ${error.meta?.target?.[0] || "field"} already exists`,
      });
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/categories/:id - Delete category (Protected: ADMIN)
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    await prisma.category.delete({ where: { id } });

    return res
      .status(200)
      .json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
