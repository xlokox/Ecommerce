// controllers/dasboard/productController.js
import formidable from "formidable";
import { responseReturn } from "../../utiles/response.js";
import cloudinary from "cloudinary";
import productModel from "../../models/productModel.js";

// קביעת קונפיגורציית cloudinary – אפשר להעביר זאת גם למיקום מרכזי אחר
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

class ProductController {
  // הוספת מוצר חדש
  add_product = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, field, files) => {
      if (err) return responseReturn(res, 400, { error: err.message });
      let { name, category, description, stock, price, discount, shopName, brand } = field;
      let { images } = files;
      name = name.trim();
      const slug = name.split(" ").join("-");
      try {
        let allImageUrl = [];
        if (!Array.isArray(images)) {
          images = [images];
        }
        for (let i = 0; i < images.length; i++) {
          const result = await cloudinary.v2.uploader.upload(images[i].filepath, { folder: "products" });
          allImageUrl.push(result.url);
        }
        await productModel.create({
          sellerId: id,
          name,
          slug,
          shopName,
          category: category.trim(),
          description: description.trim(),
          stock: parseInt(stock),
          price: parseInt(price),
          discount: parseInt(discount),
          images: allImageUrl,
          brand: brand.trim(),
        });
        responseReturn(res, 201, { message: "Product Added Successfully" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // קבלת רשימת מוצרים
  products_get = async (req, res) => {
    const { page, searchValue, parPage } = req.query;
    const { id } = req;
    const skipPage = parseInt(parPage) * (parseInt(page) - 1);
    try {
      if (searchValue) {
        const products = await productModel
          .find({ $text: { $search: searchValue }, sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel
          .find({ $text: { $search: searchValue }, sellerId: id })
          .countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      } else {
        const products = await productModel
          .find({ sellerId: id })
          .skip(skipPage)
          .limit(parPage)
          .sort({ createdAt: -1 });
        const totalProduct = await productModel.find({ sellerId: id }).countDocuments();
        responseReturn(res, 200, { products, totalProduct });
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // קבלת מוצר לפי ID
  product_get = async (req, res) => {
    const { productId } = req.params;
    try {
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product });
    } catch (error) {
      console.log(error.message);
    }
  };

  // עדכון מוצר
  product_update = async (req, res) => {
    let { name, description, stock, price, category, discount, brand, productId } = req.body;
    name = name.trim();
    const slug = name.split(" ").join("-");
    try {
      await productModel.findByIdAndUpdate(productId, {
        name,
        description,
        stock,
        price,
        category,
        discount,
        brand,
        productId,
        slug,
      });
      const product = await productModel.findById(productId);
      responseReturn(res, 200, { product, message: "Product Updated Successfully" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // עדכון תמונת מוצר
  product_image_update = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, field, files) => {
      if (err) return responseReturn(res, 400, { error: err.message });
      const { oldImage, productId } = field;
      const { newImage } = files;
      try {
        const result = await cloudinary.v2.uploader.upload(newImage.filepath, { folder: "products" });
        if (result) {
          let product = await productModel.findById(productId);
          let images = product.images;
          const index = images.findIndex((img) => img === oldImage);
          if (index !== -1) images[index] = result.url;
          await productModel.findByIdAndUpdate(productId, { images });
          product = await productModel.findById(productId);
          responseReturn(res, 200, { product, message: "Product Image Updated Successfully" });
        } else {
          responseReturn(res, 404, { error: "Image Upload Failed" });
        }
      } catch (error) {
        responseReturn(res, 404, { error: error.message });
      }
    });
  };
}

export default new ProductController();
