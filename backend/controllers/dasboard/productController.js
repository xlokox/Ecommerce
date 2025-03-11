import formidable from "formidable";
import { responseReturn } from "../../utiles/response.js";
import cloudinary from "cloudinary";
import productModel from "../../models/productModel.js";
import categoryModel from "../../models/categoryModel.js";

// הגדרת Cloudinary – אם לא מוגדר בקובץ נפרד
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

class ProductController {
  // הוספת מוצר חדש – ללא דרישת sellerId
  add_product = async (req, res) => {
    // נסתכל על req.body.sellerId במקרה ואתם רוצים לשלב אותו, אך כרגע נסיר אותו
    // const sellerId = req.id || req.body.sellerId;
    // אם אין דרישה לספק sellerId, לא נבדוק אותו.

    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) {
        return responseReturn(res, 400, { error: `Form parse error: ${err.message}` });
      }

      let { name, category, description, stock, price, discount, shopName, brand } = fields;
      let { images } = files;

      // בדיקות חובה
      if (!name) {
        return responseReturn(res, 400, { error: "No 'name' field provided" });
      }
      if (!category) {
        return responseReturn(res, 400, { error: "No 'category' field provided" });
      }
      if (!images) {
        return responseReturn(res, 400, { error: "No 'images' file provided" });
      }

      // בדיקת קטגוריה קיימת במסד הנתונים
      const cat = await categoryModel.findOne({ name: category.trim() });
      if (!cat) {
        return responseReturn(res, 404, {
          error: `Category '${category}' not found. Please add it first or check the name.`,
        });
      }

      // עיבוד השדות
      name = name.trim();
      category = category.trim();
      description = description ? description.trim() : "";
      shopName = shopName ? shopName.trim() : "";
      brand = brand ? brand.trim() : "";
      const slug = name.split(" ").join("-");

      // המרה למספרים
      const stockNum = parseInt(stock) || 0;
      const priceNum = parseInt(price) || 0;
      const discountNum = parseInt(discount) || 0;

      // טיפול בתמונות – ודא שהן במערך
      let allImageUrl = [];
      if (!Array.isArray(images)) {
        images = [images];
      }

      try {
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i].filepath, {
            folder: "products",
          });
          allImageUrl.push(result.url);
        }

        // יצירת מסמך חדש במסד הנתונים ללא sellerId
        await productModel.create({
          // אין שדה sellerId, אם רוצים להשאיר אותו אפשר להסיר את השורה או להשאיר כ-null
          // sellerId: null,
          name,
          slug,
          shopName,
          category,
          description,
          stock: stockNum,
          price: priceNum,
          discount: discountNum,
          images: allImageUrl,
          brand,
        });

        return responseReturn(res, 201, { message: "Product Added Successfully" });
      } catch (error) {
        console.error("add_product Error:", error);
        return responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // קבלת רשימת מוצרים
  products_get = async (req, res) => {
    try {
      const { page, searchValue, parPage } = req.query;
      const skipPage = parPage && page ? parseInt(parPage) * (parseInt(page) - 1) : 0;
      if (searchValue) {
        const products = await productModel
          .find({ $text: { $search: searchValue } })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ $text: { $search: searchValue } })
          .countDocuments();
        return responseReturn(res, 200, { products, totalProduct });
      } else {
        const products = await productModel
          .find({})
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel.find({}).countDocuments();
        return responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {
      console.log("products_get Error:", error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // קבלת מוצר לפי ID
  product_get = async (req, res) => {
    try {
      const { productId } = req.params;
      const product = await productModel.findById(productId);
      if (!product) {
        return responseReturn(res, 404, { error: "Product not found" });
      }
      return responseReturn(res, 200, { product });
    } catch (error) {
      console.log("product_get Error:", error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // עדכון מוצר
  product_update = async (req, res) => {
    try {
      let { name, description, stock, price, category, discount, brand, productId } = req.body;
      if (!productId) {
        return responseReturn(res, 400, { error: "No 'productId' field provided" });
      }
      // בדיקת מוצר קיים
      const existingProduct = await productModel.findById(productId);
      if (!existingProduct) {
        return responseReturn(res, 404, { error: "Product not found" });
      }
      name = name ? name.trim() : existingProduct.name;
      description = description ? description.trim() : existingProduct.description;
      category = category ? category.trim() : existingProduct.category;
      brand = brand ? brand.trim() : existingProduct.brand;
      const slug = name.split(" ").join("-");
      const stockNum = parseInt(stock) || existingProduct.stock;
      const priceNum = parseInt(price) || existingProduct.price;
      const discountNum = parseInt(discount) || existingProduct.discount;
      // בדיקת קטגוריה אם נשלח ערך
      if (category) {
        const cat = await categoryModel.findOne({ name: category });
        if (!cat) {
          return responseReturn(res, 404, { error: `Category '${category}' not found` });
        }
      }
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        stock: stockNum,
        price: priceNum,
        category,
        discount: discountNum,
        brand,
        slug,
      });
      const product = await productModel.findById(productId);
      return responseReturn(res, 200, { product, message: "Product Updated Successfully" });
    } catch (error) {
      console.log("product_update Error:", error.message);
      return responseReturn(res, 500, { error: error.message });
    }
  };

  // עדכון תמונת מוצר
  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, fields, files) => {
      if (err) return responseReturn(res, 400, { error: err.message });
      const { oldImage, productId } = fields;
      const { newImage } = files;
      try {
        if (!productId) {
          return responseReturn(res, 400, { error: "No 'productId' provided" });
        }
        let product = await productModel.findById(productId);
        if (!product) {
          return responseReturn(res, 404, { error: "Product not found" });
        }
        if (!newImage) {
          return responseReturn(res, 400, { error: "No 'newImage' file provided" });
        }
        const result = await cloudinary.v2.uploader.upload(newImage.filepath, { folder: "products" });
        if (!result) {
          return responseReturn(res, 404, { error: "Image Upload Failed" });
        }
        let images = product.images;
        const index = images.findIndex((img) => img === oldImage);
        if (index !== -1) {
          images[index] = result.url;
        } else {
          return responseReturn(res, 404, { error: "Old image not found in product" });
        }
        await productModel.findByIdAndUpdate(productId, { images });
        product = await productModel.findById(productId);
        return responseReturn(res, 200, { product, message: "Product Image Updated Successfully" });
      } catch (error) {
        console.log("product_image_update Error:", error);
        return responseReturn(res, 500, { error: error.message });
      }
    });
  };
}

export default new ProductController();
