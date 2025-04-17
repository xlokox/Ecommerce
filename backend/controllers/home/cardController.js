import cardModel from '../../models/cardModel.js';
import wishlistModel from '../../models/wishlistModel.js';
import { responseReturn } from '../../utils/response.js';
import { ObjectId } from 'mongodb';

class CardController {
  // הוספת מוצר לסל
  add_to_card = async (req, res) => {
    console.log('Adding to cart, request body:', req.body);

    // Check if req.body is undefined or empty
    if (!req.body) {
      console.log('Request body is undefined');
      return responseReturn(res, 400, { error: 'Invalid request: Empty body' });
    }

    const { userId, productId, quantity } = req.body;

    // Check if required fields are present
    if (!userId || !productId || !quantity) {
      console.log('Missing required fields:', { userId, productId, quantity });
      return responseReturn(res, 400, { error: 'Missing required fields' });
    }

    console.log('Adding to cart:', { userId, productId, quantity });
    try {
      // Convert IDs to ObjectId if they're strings
      const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

      const product = await cardModel.findOne({
        $and: [
          { productId: { $eq: productObjectId } },
          { userId: { $eq: userObjectId } }
        ]
      });

      if (product) {
        console.log('Product already in cart');
        return responseReturn(res, 404, { error: "Product Already Added To Card" });
      } else {
        const productCreated = await cardModel.create({
          userId: userObjectId,
          productId: productObjectId,
          quantity
        });
        console.log('Product added to cart successfully');
        return responseReturn(res, 201, { message: "Added To Card Successfully", product: productCreated });
      }
    } catch (error) {
      console.log('Error adding to cart:', error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הגדלת כמות מוצר בסל
  quantity_inc = async (req, res) => {
    const { card_id } = req.params;
    try {
      const card = await cardModel.findById(card_id);
      if (!card) {
        return responseReturn(res, 404, { error: "Card Product Not Found" });
      }
      const updatedCard = await cardModel.findByIdAndUpdate(card_id, { quantity: card.quantity + 1 }, { new: true });
      return responseReturn(res, 200, { message: "Quantity Increased", updatedCard });
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // הקטנת כמות מוצר בסל
  quantity_dec = async (req, res) => {
    const { card_id } = req.params;
    try {
      const card = await cardModel.findById(card_id);
      if (!card) {
        return responseReturn(res, 404, { error: "Card Product Not Found" });
      }
      if (card.quantity > 1) {
        const updatedCard = await cardModel.findByIdAndUpdate(card_id, { quantity: card.quantity - 1 }, { new: true });
        return responseReturn(res, 200, { message: "Quantity Decreased", updatedCard });
      } else {
        return responseReturn(res, 200, { message: "Quantity Can't Be Less Than 1" });
      }
    } catch (error) {
      console.log(error.message);
      return responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  // שליפת מוצרים מהסל
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
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "products"
          }
        }
      ]);

      // Safely filter out-of-stock products
      const outOfStockProduct = card_products.filter(p => {
        return p.products && p.products[0] && p.products[0].stock < p.quantity;
      });
      console.log('Out of stock products:', outOfStockProduct.length);

      // Safely filter in-stock products
      const stockProduct = card_products.filter(p => {
        return p.products && p.products[0] && p.products[0].stock >= p.quantity;
      });
      console.log('In stock products:', stockProduct.length);

      let calculatePrice = 0;
      let buy_product_item = 0;
      for (let i = 0; i < stockProduct.length; i++) {
        const { quantity } = stockProduct[i];
        // Safely get price and discount, handling undefined values
        if (stockProduct[i].products && stockProduct[i].products[0]) {
          const { price = 0, discount = 0 } = stockProduct[i].products[0];
          if (discount !== 0) {
            calculatePrice += quantity * (price - Math.floor((price * discount) / 100));
          } else {
            calculatePrice += quantity * price;
          }
        }
        buy_product_item += quantity;
      }

      // Safely get unique seller IDs, handling undefined values
      let unique = [...new Set(stockProduct.map(p => {
        if (p.products && p.products[0] && p.products[0].sellerId) {
          return p.products[0].sellerId.toString();
        }
        return 'unknown';
      }))];

      console.log('Unique seller IDs:', unique);

      let shipping_fee = 0;
      let shipping_fee_discount = 0;

      for (let i = 0; i < unique.length; i++) {
        let price = 0;
        for (let j = 0; j < stockProduct.length; j++) {
          const tempProduct = stockProduct[j].products[0];
          if (tempProduct && tempProduct.sellerId && unique[i] === tempProduct.sellerId.toString()) {
            const { quantity } = stockProduct[j];
            const { discount = 0, price: productPrice = 0 } = tempProduct;
            if (discount !== 0) {
              price += quantity * (productPrice - Math.floor((productPrice * discount) / 100));
            } else {
              price += quantity * productPrice;
            }
          }
        }
        if (price >= 100) {
          shipping_fee_discount += 1;
        } else {
          shipping_fee += 10;
        }
      }

      const card_products_count = card_products.reduce((acc, curr) => acc + curr.quantity, 0);

      return responseReturn(res, 200, {
        card_products,
        price: calculatePrice,
        shipping_fee,
        outOfStockProduct,
        buy_product_item,
        card_products_count,
        card_product_count: stockProduct.length
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

  // הוספת מוצר לווישליסט
  add_wishlist = async (req, res) => {
    console.log('Adding to wishlist, request body:', req.body);

    // Check if req.body is undefined or empty
    if (!req.body) {
      console.log('Request body is undefined');
      return responseReturn(res, 400, { error: 'Invalid request: Empty body' });
    }

    const { userId, productId, slug } = req.body;

    // Check if required fields are present
    if (!userId || !productId || !slug) {
      console.log('Missing required fields:', { userId, productId, slug });
      return responseReturn(res, 400, { error: 'Missing required fields' });
    }

    try {
      // Convert userId to ObjectId if it's a string
      const userObjectId = typeof userId === 'string' ? new ObjectId(userId) : userId;
      const productObjectId = typeof productId === 'string' ? new ObjectId(productId) : productId;

      // Check if product is already in wishlist for this user
      const product = await wishlistModel.findOne({
        userId: userObjectId,
        slug
      });

      if (product) {
        console.log('Product already in wishlist');
        return responseReturn(res, 404, { error: 'Product Is Already In Wishlist' });
      } else {
        // Create with proper ObjectId
        const newWishlist = await wishlistModel.create({
          ...req.body,
          userId: userObjectId,
          productId: productObjectId
        });
        console.log('Product added to wishlist successfully');
        return responseReturn(res, 201, { message: 'Product Add to Wishlist Success' });
      }
    } catch (error) {
      console.log('Error adding to wishlist:', error.message);
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
