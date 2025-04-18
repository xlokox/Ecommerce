import categoryModel from '../../models/categoryModel.js';
import productModel from '../../models/productModel.js';
import reviewModel from '../../models/reviewModel.js';
import { responseReturn } from '../../utiles/response.js';
import queryProducts from '../../utiles/queryProducts.js';
import moment from 'moment';
import { Types } from 'mongoose';
const { ObjectId } = Types;

class HomeControllers {
  // פונקציה פנימית לעיצוב המוצרים למערך דו-ממדי (3 מוצרים בשורה)
  formateProduct = (products) => {
    const productArray = [];
    let i = 0;
    while (i < products.length) {
      let temp = [];
      let j = i;
      while (j < i + 3) {
        if (products[j]) {
          temp.push(products[j]);
        }
        j++;
      }
      productArray.push([...temp]);
      i = j;
    }
    return productArray;
  };

  // שליפת כל הקטגוריות
  get_categorys = async (req, res) => {
    try {
      const categorys = await categoryModel.find({});
      return responseReturn(res, 200, { categorys });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת מוצרים (עד 12 אחרונים) וכן חלוקה ל-latest, topRated, discount
  get_products = async (req, res) => {
    try {
      // מוצרים אחרונים (עד 12)
      const products = await productModel.find({}).limit(12).sort({ createdAt: -1 });

      // Latest product: 9 מוצרים אחרונים, מחולקים ל-3-שורות
      const allProduct1 = await productModel.find({}).limit(9).sort({ createdAt: -1 });
      const latest_product = this.formateProduct(allProduct1);

      // Top rated product: 9 מוצרים עם דירוג גבוה, מחולקים ל-3-שורות
      const allProduct2 = await productModel.find({}).limit(9).sort({ rating: -1 });
      const topRated_product = this.formateProduct(allProduct2);

      // Discount product: 9 מוצרים עם הנחה, מחולקים ל-3-שורות
      const allProduct3 = await productModel.find({}).limit(9).sort({ discount: -1 });
      const discount_product = this.formateProduct(allProduct3);

      return responseReturn(res, 200, {
        products,
        latest_product,
        topRated_product,
        discount_product
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת טווח מחירים ומוצרים אחרונים
  price_range_product = async (req, res) => {
    try {
      const priceRange = { low: 0, high: 0 };
      const products = await productModel.find({}).limit(9).sort({ createdAt: -1 });
      const latest_product = this.formateProduct(products);
      const getForPrice = await productModel.find({}).sort({ price: 1 });
      if (getForPrice.length > 0) {
        priceRange.high = getForPrice[getForPrice.length - 1].price;
        priceRange.low = getForPrice[0].price;
      }
      return responseReturn(res, 200, { latest_product, priceRange });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת מוצרים לפי קריטריונים (קטגוריה, דירוג, מחיר, חיפוש)
  query_products = async (req, res) => {
    const parPage = 12;
    req.query.parPage = parPage;

    console.log('Query params:', req.query);
    console.log('Category:', req.query.category);

    try {
      let products;

      // If category is provided, try to filter by category ID in the database first
      if (req.query.category) {
        try {
          // Try to find products with the exact category ID
          products = await productModel.find({ category: req.query.category }).populate('category', 'name').sort({ createdAt: -1 });
          console.log(`Found ${products.length} products with category ID ${req.query.category} in database`);
        } catch (err) {
          console.log('Error filtering by category in database:', err.message);
          // Fallback to getting all products
          products = await productModel.find({}).populate('category', 'name').sort({ createdAt: -1 });
        }
      } else {
        // Get all products if no category is specified
        products = await productModel.find({}).populate('category', 'name').sort({ createdAt: -1 });
      }

      // Add categoryName to each product for easier filtering
      products = products.map(product => {
        const p = product.toObject();
        if (p.category && p.category.name) {
          p.categoryName = p.category.name;
        }
        return p;
      });

      // Apply additional filters
      const totalProduct = new queryProducts(products, req.query)
        .ratingQuery()
        .searchQuery()
        .priceQuery()
        .sortByPrice()
        .countProducts();

      const result = new queryProducts(products, req.query)
        .ratingQuery()
        .priceQuery()
        .searchQuery()
        .sortByPrice()
        .skip()
        .limit()
        .getProducts();

      console.log(`Returning ${result.length} products after filtering`);
      return responseReturn(res, 200, { products: result, totalProduct, parPage });
    } catch (error) {
      console.log('Error in query_products:', error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת פרטי מוצר בודד יחד עם מוצרים קשורים ומוצרים נוספים מאותו מוכר
  product_details = async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await productModel.findOne({ slug });
      if (!product) {
        return responseReturn(res, 404, { error: "Product not found" });
      }
      const relatedProducts = await productModel
        .find({
          $and: [
            { _id: { $ne: product._id } },
            { category: { $eq: product.category } }
          ]
        })
        .limit(12);
      const moreProducts = await productModel
        .find({
          $and: [
            { _id: { $ne: product._id } },
            { sellerId: { $eq: product.sellerId } }
          ]
        })
        .limit(3);
      return responseReturn(res, 200, {
        product,
        relatedProducts,
        moreProducts
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הוספת ביקורת למוצר
  submit_review = async (req, res) => {
    const { productId, rating, review, name } = req.body;
    try {
      await reviewModel.create({
        productId,
        name,
        rating,
        review,
        date: moment(Date.now()).format("LL")
      });
      let rat = 0;
      const reviews = await reviewModel.find({ productId });
      for (let i = 0; i < reviews.length; i++) {
        rat += reviews[i].rating;
      }
      let productRating = 0;
      if (reviews.length !== 0) {
        productRating = (rat / reviews.length).toFixed(1);
      }
      await productModel.findByIdAndUpdate(productId, { rating: productRating });
      return responseReturn(res, 201, { message: "Review Added Successfully" });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת ביקורות למוצר
  get_reviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    pageNo = parseInt(pageNo) || 1;
    const limit = 5;
    const skipPage = limit * (pageNo - 1);
    try {
      let getRating = await reviewModel.aggregate([
        {
          $match: {
            productId: { $eq: new ObjectId(productId) },
            rating: { $not: { $size: 0 } }
          }
        },
        { $unwind: "$rating" },
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 }
          }
        }
      ]);
      let rating_review = [
        { rating: 5, sum: 0 },
        { rating: 4, sum: 0 },
        { rating: 3, sum: 0 },
        { rating: 2, sum: 0 },
        { rating: 1, sum: 0 }
      ];
      for (let i = 0; i < rating_review.length; i++) {
        for (let j = 0; j < getRating.length; j++) {
          if (rating_review[i].rating === getRating[j]._id) {
            rating_review[i].sum = getRating[j].count;
            break;
          }
        }
      }
      const getAll = await reviewModel.find({ productId });
      const reviews = await reviewModel
        .find({ productId })
        .skip(skipPage)
        .limit(limit)
        .sort({ createdAt: -1 });
      return responseReturn(res, 200, {
        reviews,
        totalReview: getAll.length,
        rating_review
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // **פונקציה חדשה**: שליפת מוצרים מקטגוריות מובילות (Top Category)
  get_top_category_products = async (req, res) => {
    try {
      // הגדרה קבועה של קטגוריות שנחשבות "טופ"
      const topCategories = ["Shoes", "Watches", "Phones", "Electronics"];
      const products = await productModel
        .find({ category: { $in: topCategories } })
        .limit(12)
        .sort({ createdAt: -1 });
      return responseReturn(res, 200, { products });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

export default new HomeControllers();
