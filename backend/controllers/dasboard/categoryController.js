// categoryController.js
import formidable from "formidable";
import { responseReturn } from "../../utiles/response.js";
import cloudinary from "cloudinary"; // כאן נשתמש רק ב-cloudinary.v2.uploader
import categoryModel from "../../models/categoryModel.js";

class CategoryController {
  // הוספת קטגוריה
  add_category = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 400, { error: "Form parse error" });
      }

      // בדיקות בסיסיות
      if (!fields.name) {
        return responseReturn(res, 400, { error: "No 'name' field provided" });
      }
      if (!files.image) {
        return responseReturn(res, 400, { error: "No 'image' file provided" });
      }

      let { name } = fields;
      let { image } = files;

      try {
        name = name.trim();
        const slug = name.split(" ").join("-");

        // העלאה ל-Cloudinary (כאן אין config!)
        const result = await cloudinary.v2.uploader.upload(image.filepath, {
          folder: "categorys"
        });

        if (!result) {
          return responseReturn(res, 404, { error: "Image Upload Failed" });
        }

        // יצירת מסמך ב-DB
        const category = await categoryModel.create({
          name,
          slug,
          image: result.url
        });

        return responseReturn(res, 201, {
          category,
          message: "Category Added Successfully"
        });

      } catch (error) {
        console.error("add_category Error:", error);
        return responseReturn(res, 500, { error: "Internal Server Error" });
      }
    });
  };

  // שליפת קטגוריות
  get_category = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    try {
      let skipPage = parPage && page ? parseInt(parPage) * (parseInt(page) - 1) : 0;

      if (searchValue && page && parPage) {
        // חיפוש לפי searchValue
        const categorys = await categoryModel
          .find({ $text: { $search: searchValue } })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel
          .find({ $text: { $search: searchValue } })
          .countDocuments();

        return responseReturn(res, 200, { categorys, totalCategory });

      } else if (searchValue === "" && page && parPage) {
        // ללא searchValue, אבל עם עמוד ופר-עמוד
        const categorys = await categoryModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });

        const totalCategory = await categoryModel.find({}).countDocuments();

        return responseReturn(res, 200, { categorys, totalCategory });

      } else {
        // ללא עמוד ופר-עמוד (או ללא searchValue)
        const categorys = await categoryModel.find({}).sort({ createdAt: -1 });
        const totalCategory = await categoryModel.find({}).countDocuments();

        return responseReturn(res, 200, { categorys, totalCategory });
      }

    } catch (error) {
      console.error("get_category Error:", error);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // עדכון קטגוריה
  update_category = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 400, { error: "Form parse error" });
      }

      let { name } = fields;
      const { id } = req.params;

      try {
        if (!name) {
          return responseReturn(res, 400, { error: "No 'name' field provided" });
        }

        name = name.trim();
        const slug = name.split(" ").join("-");
        let updateData = { name, slug };

        // אם יש קובץ תמונה חדש, מעלים ל-Cloudinary
        if (files.image) {
          const result = await cloudinary.v2.uploader.upload(files.image.filepath, {
            folder: "categorys"
          });
          if (!result) {
            return responseReturn(res, 404, { error: "Image Upload Failed" });
          }
          updateData.image = result.url;
        }

        const category = await categoryModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!category) {
          return responseReturn(res, 404, { error: "Category not found" });
        }

        return responseReturn(res, 200, { category, message: "Category Updated successfully" });

      } catch (error) {
        console.error("update_category Error:", error);
        return responseReturn(res, 500, { error: "Internal Server Error" });
      }
    });
  };

  // מחיקת קטגוריה
  deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const deleteCategory = await categoryModel.findByIdAndDelete(categoryId);

      if (!deleteCategory) {
        console.log(`Category with id ${categoryId} not found`);
        return res.status(404).json({ message: "Category not found" });
      }
      return res.status(200).json({ message: "Category deleted successfully" });

    } catch (error) {
      console.error(`Error delete category with id ${req.params.id}:`, error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
}

export default new CategoryController();
