import cardModel from '../../models/cardModel.js';
import { responseReturn } from '../../utiles/response.js';
import { Types } from 'mongoose';
const { ObjectId } = Types;
import wishlistModel from '../../models/wishlistModel.js';

class CardController {
  // הוספת מוצר לסל
  add_to_card = async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
      const product = await cardModel.findOne({
        $and: [
          { productId: { $eq: productId } },
          { userId: { $eq: userId } }
        ]
      });
      if (product) {
        return responseReturn(res, 404, { error: "Product Already Added To Card" });
      } else {
        const productCreated = await cardModel.create({
          userId,
          productId,
          quantity
        });
        return responseReturn(res, 201, { message: "Added To Card Successfully", product: productCreated });
      }
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת מוצרים בסל לפי משתמש
  get_card_products = async (req, res) => {
    const co = 5;
    const { userId } = req.params;
    console.log('Getting cart products for user ID:', userId);
    try {
      // Convert userId to ObjectId if it's a string
      const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

      const card_products = await cardModel.aggregate([
        {
          $match: {
            userId: { $eq: userObjectId }
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'productId',
            foreignField: "_id",
            as: 'products'
          }
        }
      ]);

      let buy_product_item = 0;
      let calculatePrice = 0;
      let card_product_count = 0;

      // Safely filter out-of-stock products
      const outOfStockProduct = card_products.filter(p => {
        return p.products && p.products[0] && p.products[0].stock < p.quantity;
      });
      console.log('Out of stock products:', outOfStockProduct.length);
      for (let i = 0; i < outOfStockProduct.length; i++) {
        card_product_count += outOfStockProduct[i].quantity;
      }

      // Safely filter in-stock products
      const stockProduct = card_products.filter(p => {
        return p.products && p.products[0] && p.products[0].stock >= p.quantity;
      });
      console.log('In stock products:', stockProduct.length);
      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i];
        // Fix: Increment card_product_count correctly
        card_product_count += quantity;
        buy_product_item += quantity;
        // Safely get price and discount, handling undefined values
        if (stockProduct[i].products && stockProduct[i].products[0]) {
          const { price = 0, discount = 0 } = stockProduct[i].products[0];
          if (discount !== 0) {
            calculatePrice += quantity * (price - Math.floor((price * discount) / 100));
          } else {
            calculatePrice += quantity * price;
          }
        }
      }

      let p = [];
      // Safely get unique seller IDs, handling undefined values
      let unique = [...new Set(stockProduct.map(p => {
        if (p.products && p.products[0] && p.products[0].sellerId) {
          return p.products[0].sellerId.toString();
        }
        return 'unknown';
      }))];

      console.log('Unique seller IDs:', unique);
      for (let i = 0; i < unique.length; i++) {
        let sellerPrice = 0;
        for (let j = 0; j < stockProduct.length; j++) {
          const tempProduct = stockProduct[j].products[0];
          if (tempProduct && tempProduct.sellerId && unique[i] === tempProduct.sellerId.toString()) {
            let pri = 0;
            if (tempProduct.discount !== 0) {
              pri = tempProduct.price - Math.floor((tempProduct.price * tempProduct.discount) / 100);
            } else {
              pri = tempProduct.price;
            }
            // הפחתה בהתאם ל־co (למשל, הנחה נוספת)
            pri = pri - Math.floor((pri * co) / 100);
            sellerPrice += pri * stockProduct[j].quantity;
            p[i] = {
              sellerId: unique[i],
              shopName: tempProduct.shopName,
              price: sellerPrice,
              products: p[i] && p[i].products
                ? [
                    ...p[i].products,
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProduct
                    }
                  ]
                : [
                    {
                      _id: stockProduct[j]._id,
                      quantity: stockProduct[j].quantity,
                      productInfo: tempProduct
                    }
                  ]
            };
          }
        }
      }

      // Log the data for debugging
      console.log('Card products:', {
        card_products_count: p.length,
        price: calculatePrice,
        card_product_count,
        shipping_fee: 20 * p.length,
        outOfStockProduct_count: outOfStockProduct.length,
        buy_product_item
      });

      return responseReturn(res, 200, {
        card_products: p,
        price: calculatePrice,
        card_product_count,
        shipping_fee: 20 * p.length,
        outOfStockProduct,
        buy_product_item
      });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // מחיקת מוצר מהסל
  delete_card_products = async (req, res) => {
    const { card_id } = req.params;
    console.log('Deleting card product with ID:', card_id);
    try {
      const result = await cardModel.findByIdAndDelete(card_id);
      console.log('Delete result:', result);
      return responseReturn(res, 200, { message: "Product Remove Successfully" });
    } catch (error) {
      console.log('Error deleting card product:', error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // העלאת כמות מוצר
  quantity_inc = async (req, res) => {
    const { card_id } = req.params;
    try {
      const product = await cardModel.findById(card_id);
      const { quantity } = product;
      await cardModel.findByIdAndUpdate(card_id, { quantity: quantity + 1 });
      return responseReturn(res, 200, { message: "Qty Updated" });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הפחתת כמות מוצר
  quantity_dec = async (req, res) => {
    const { card_id } = req.params;
    try {
      const product = await cardModel.findById(card_id);
      const { quantity } = product;
      await cardModel.findByIdAndUpdate(card_id, { quantity: quantity - 1 });
      return responseReturn(res, 200, { message: "Qty Updated" });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הוספת מוצר לווישליסט
  add_wishlist = async (req, res) => {
    const { slug } = req.body;
    try {
      const product = await wishlistModel.findOne({ slug });
      if (product) {
        return responseReturn(res, 404, { error: 'Product Is Already In Wishlist' });
      } else {
        await wishlistModel.create(req.body);
        return responseReturn(res, 201, { message: 'Product Add to Wishlist Success' });
      }
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת מוצרים מהווישליסט של משתמש
  get_wishlist = async (req, res) => {
    const { userId } = req.params;
    console.log('Getting wishlist for user ID:', userId);
    try {
      // Convert userId to ObjectId if it's a string
      const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;

      const wishlists = await wishlistModel.find({ userId: userObjectId });
      console.log('Found wishlist items:', wishlists.length);
      return responseReturn(res, 200, { wishlistCount: wishlists.length, wishlists });
    } catch (error) {
      console.log('Error getting wishlist:', error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הסרת מוצר מהווישליסט
  remove_wishlist = async (req, res) => {
    const { wishlistId } = req.params;
    console.log('Removing wishlist item with ID:', wishlistId);
    try {
      const result = await wishlistModel.findByIdAndDelete(wishlistId);
      console.log('Remove result:', result);
      return responseReturn(res, 200, { message: 'Wishlist Product Remove', wishlistId });
    } catch (error) {
      console.log('Error removing wishlist item:', error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };
}

export default new CardController();
