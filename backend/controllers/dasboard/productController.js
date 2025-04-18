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
  // הוספת מוצר חדש – עם אותנטיקציה
  add_product = async (req, res) => {
    // הדפסת פרטי הבקשה לצורך דיבאג
    console.log('Add product request received');
    console.log('Auth info:', { id: req.id, role: req.role });
    console.log('Headers:', req.headers);

    // השתמש ב-sellerId מהאותנטיקציה אם קיים
    const sellerId = req.id;

    // הגדרת formidable עם אפשרויות מתקדמות
    const form = formidable({
      multiples: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      keepExtensions: true,
      allowEmptyFiles: false,
      maxFields: 20,
      maxFieldsSize: 20 * 1024 * 1024, // 20MB total form size
      uploadDir: '/tmp', // Make sure this directory exists and is writable
      filter: part => {
        // Accept all files
        return true;
      }
    });

    // Log the request headers for debugging
    console.log('Request headers:', req.headers);
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return responseReturn(res, 400, { error: `Form parse error: ${err.message}` });
      }

      console.log('Form parsed successfully');
      console.log('Fields:', fields);
      console.log('Files:', Object.keys(files));

      // Handle different formats of form data
      // Some clients might send fields as arrays with single values
      const normalizeField = (field) => {
        if (Array.isArray(field)) {
          return field[0];
        }
        return field;
      };

      // Extract and normalize fields
      let name = normalizeField(fields.name);
      let category = normalizeField(fields.category);
      let description = normalizeField(fields.description);
      let stock = normalizeField(fields.stock);
      let price = normalizeField(fields.price);
      let discount = normalizeField(fields.discount);
      let shopName = normalizeField(fields.shopName);
      let brand = normalizeField(fields.brand);

      // Log normalized fields
      console.log('Normalized fields:', {
        name, category, description, stock, price, discount, shopName, brand
      });

      // Handle images
      let images = files.images;
      console.log('Images type:', typeof images);
      console.log('Is images array?', Array.isArray(images));

      // בדיקות חובה מפורטות
      console.log('Validating required fields:');
      const validationErrors = [];

      if (!name) {
        console.log('ERROR: Missing name field');
        validationErrors.push("No 'name' field provided");
      }

      if (!category) {
        console.log('ERROR: Missing category field');
        validationErrors.push("No 'category' field provided");
      }

      if (!images) {
        console.log('WARNING: Missing images file, will try to continue');
        // Don't add validation error, allow product creation without images
        // validationErrors.push("No 'images' file provided");
      }

      if (!price) {
        console.log('ERROR: Missing price field');
        validationErrors.push("No 'price' field provided");
      }

      if (!stock) {
        console.log('ERROR: Missing stock field');
        validationErrors.push("No 'stock' field provided");
      }

      if (!brand) {
        console.log('ERROR: Missing brand field');
        validationErrors.push("No 'brand' field provided");
      }

      // Description and shopName are now optional with defaults in the model
      if (!description) {
        console.log('WARNING: Missing description field, will use default');
        description = '';
      }

      if (!shopName) {
        console.log('WARNING: Missing shopName field, will use default');
        shopName = 'EasyShop';
      }

      if (!discount) {
        console.log('WARNING: Missing discount field, will use default');
        discount = 0;
      }

      if (validationErrors.length > 0) {
        return responseReturn(res, 400, {
          error: "Validation errors",
          details: validationErrors,
          receivedFields: {
            name: !!name,
            category: !!category,
            images: !!images,
            price: !!price,
            stock: !!stock,
            brand: !!brand,
            description: !!description,
            shopName: !!shopName,
            discount: !!discount
          }
        });
      }

      // בדיקת קטגוריה קיימת במסד הנתונים
      console.log(`Searching for category: '${category.trim()}'`);
      const cat = await categoryModel.findOne({ name: category.trim() });
      console.log('Category search result:', cat);

      if (!cat) {
        // Try case-insensitive search as fallback
        console.log('Trying case-insensitive search');
        const caseInsensitiveCat = await categoryModel.findOne({
          name: { $regex: new RegExp('^' + category.trim() + '$', 'i') }
        });
        console.log('Case-insensitive search result:', caseInsensitiveCat);

        if (caseInsensitiveCat) {
          // Use the correctly cased category name from the database
          category = caseInsensitiveCat.name;
          console.log(`Using correctly cased category name: ${category}`);
        } else {
          return responseReturn(res, 404, {
            error: `Category '${category}' not found. Please add it first or check the name.`,
          });
        }
      } else {
        // Use the correctly cased category name from the database
        category = cat.name;
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

      // Handle case where images might be undefined or null
      if (!images) {
        console.log('No images provided, using fallback image');
        allImageUrl.push('https://res.cloudinary.com/dbx/image/upload/v1/products/product_placeholder');
      } else {
        // Convert to array if not already
        if (!Array.isArray(images)) {
          images = [images];
        }
      }

      try {
        // Only attempt to upload images if they exist
        if (images && images.length > 0) {
          console.log(`Attempting to upload ${images.length} images to Cloudinary`);
          for (let i = 0; i < images.length; i++) {
            console.log(`Uploading image ${i+1}/${images.length}: ${images[i].filepath}`);
            try {
              const result = await cloudinary.v2.uploader.upload(images[i].filepath, {
                folder: "products",
              });
              console.log(`Image ${i+1} uploaded successfully: ${result.url}`);
              allImageUrl.push(result.url);
            } catch (uploadError) {
              console.error(`Error uploading image ${i+1}:`, uploadError);
              // Continue with other images instead of failing completely
              // But if no images are uploaded successfully, the product creation will fail
            }
          }
        }

        if (allImageUrl.length === 0) {
          console.log('No images were uploaded successfully. Using fallback image.');
          // Use a fallback image if all uploads fail
          allImageUrl.push('https://res.cloudinary.com/dbx/image/upload/v1/products/product_placeholder');
          // Alternatively, you can return an error
          // return responseReturn(res, 500, { error: "Failed to upload any images. Please try again." });
        }

        // יצירת מסמך חדש במסד הנתונים עם sellerId אם קיים
        console.log('Creating product with the following data:');
        const productData = {
          // הוספת sellerId אם קיים
          ...(sellerId && { sellerId }),
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
        };

        console.log(JSON.stringify(productData, null, 2));

        const newProduct = await productModel.create(productData);
        console.log('Product created successfully with ID:', newProduct._id);

        return responseReturn(res, 201, {
          message: "Product Added Successfully",
          product: newProduct
        });
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
