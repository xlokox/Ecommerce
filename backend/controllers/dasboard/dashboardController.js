// controllers/dasboard/dashboardController.js
import { responseReturn } from "../../utiles/response.js";
import myShopWallet from "../../models/myShopWallet.js";
import productModel from "../../models/productModel.js";
import customerOrder from "../../models/customerOrder.js";
import sellerModel from "../../models/sellerModel.js";
import adminSellerMessage from "../../models/chat/adminSellerMessage.js";
import sellerWallet from "../../models/sellerWallet.js";
import authOrder from "../../models/authOrder.js";
import sellerCustomerMessage from "../../models/chat/sellerCustomerMessage.js";
import bannerModel from "../../models/bannerModel.js";
import { Types } from "mongoose";
const { ObjectId } = Types;
import cloudinary from "cloudinary";
import formidable from "formidable";

// קביעת קונפיגורציית cloudinary – מיקום מרכזי
cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true
});

class DashboardController {
  get_admin_dashboard_data = async (req, res) => {
    const { id } = req;
    try {
      // Basic stats
      const totalSale = await myShopWallet.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);
      const totalProduct = await productModel.find({}).countDocuments();
      const totalOrder = await customerOrder.find({}).countDocuments();
      const totalSeller = await sellerModel.find({}).countDocuments();
      const messages = await adminSellerMessage.find({}).limit(3);
      const recentOrders = await customerOrder.find({}).limit(5);

      // Monthly sales data for the last 12 months
      const monthlySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            totalSales: { $sum: "$price" },
            orderCount: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);

      // Daily sales for the last 30 days
      const dailySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" }
            },
            totalSales: { $sum: "$price" },
            orderCount: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
      ]);

      // Order status distribution
      const orderStatusStats = await customerOrder.aggregate([
        {
          $group: {
            _id: "$delivery_status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Payment status distribution
      const paymentStatusStats = await customerOrder.aggregate([
        {
          $group: {
            _id: "$payment_status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Top selling products
      const topProducts = await customerOrder.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
            totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            name: "$productInfo.name",
            totalSold: 1,
            totalRevenue: 1,
            image: "$productInfo.images"
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);

      responseReturn(res, 200, {
        totalProduct,
        totalOrder,
        totalSeller,
        messages,
        recentOrders,
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        monthlySales,
        dailySales,
        orderStatusStats,
        paymentStatusStats,
        topProducts
      });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };

  get_seller_dashboard_data = async (req, res) => {
    const { id } = req;
    try {
      // Use the same admin data for sellers (since sellers are admins)
      const totalSale = await myShopWallet.aggregate([
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);
      const totalProduct = await productModel.find({}).countDocuments();
      const totalOrder = await customerOrder.find({}).countDocuments();
      const totalSeller = await sellerModel.find({}).countDocuments();
      const messages = await adminSellerMessage.find({}).limit(3);
      const recentOrders = await customerOrder.find({}).limit(5);

      // Monthly sales data for the last 12 months
      const monthlySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" }
            },
            totalSales: { $sum: "$price" },
            orderCount: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ]);

      // Daily sales for the last 30 days
      const dailySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(new Date().setDate(new Date().getDate() - 30))
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" }
            },
            totalSales: { $sum: "$price" },
            orderCount: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
        }
      ]);

      // Order status distribution
      const orderStatusStats = await customerOrder.aggregate([
        {
          $group: {
            _id: "$delivery_status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Payment status distribution
      const paymentStatusStats = await customerOrder.aggregate([
        {
          $group: {
            _id: "$payment_status",
            count: { $sum: 1 }
          }
        }
      ]);

      // Top selling products
      const topProducts = await customerOrder.aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
            totalRevenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
          }
        },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "productInfo"
          }
        },
        { $unwind: "$productInfo" },
        {
          $project: {
            name: "$productInfo.name",
            totalSold: 1,
            totalRevenue: 1,
            image: "$productInfo.images"
          }
        },
        { $sort: { totalSold: -1 } },
        { $limit: 5 }
      ]);

      responseReturn(res, 200, {
        totalProduct,
        totalOrder,
        totalSeller,
        messages,
        recentOrders,
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0,
        monthlySales,
        dailySales,
        orderStatusStats,
        paymentStatusStats,
        topProducts
      });
    } catch (error) {
      console.log(error.message);
      responseReturn(res, 500, { error: error.message });
    }
  };

  add_banner = async (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, async (err, field, files) => {
      const { productId } = field;
      const { mainban } = files;
      try {
        const { slug } = await productModel.findById(productId);
        const result = await cloudinary.v2.uploader.upload(mainban.filepath, { folder: "banners" });
        const banner = await bannerModel.create({
          productId,
          banner: result.url,
          link: slug
        });
        responseReturn(res, 200, { banner, message: "Banner Add Success" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_banner = async (req, res) => {
    const { productId } = req.params;
    try {
      const banner = await bannerModel.findOne({ productId: new ObjectId(productId) });
      responseReturn(res, 200, { banner });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  update_banner = async (req, res) => {
    const { bannerId } = req.params;
    const form = formidable({});
    form.parse(req, async (err, _, files) => {
      const { mainban } = files;
      try {
        let banner = await bannerModel.findById(bannerId);
        let temp = banner.banner.split("/");
        temp = temp[temp.length - 1];
        const imageName = temp.split(".")[0];
        await cloudinary.uploader.destroy(imageName);
        const { url } = await cloudinary.uploader.upload(mainban.filepath, { folder: "banners" });
        await bannerModel.findByIdAndUpdate(bannerId, { banner: url });
        banner = await bannerModel.findById(bannerId);
        responseReturn(res, 200, { banner, message: "Banner Updated Success" });
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  get_banners = async (req, res) => {
    try {
      const banners = await bannerModel.aggregate([
        { $sample: { size: 5 } }
      ]);
      responseReturn(res, 200, { banners });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // Real-time analytics endpoint
  get_analytics_data = async (req, res) => {
    try {
      // Get today's sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todaySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: { $gte: today }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: "$price" },
            orderCount: { $sum: 1 }
          }
        }
      ]);

      // Get hourly sales for today
      const hourlySales = await customerOrder.aggregate([
        {
          $match: {
            createdAt: { $gte: today }
          }
        },
        {
          $group: {
            _id: { $hour: "$createdAt" },
            sales: { $sum: "$price" },
            orders: { $sum: 1 }
          }
        },
        {
          $sort: { "_id": 1 }
        }
      ]);

      // Get recent activity (last 10 orders)
      const recentActivity = await customerOrder.find({})
        .sort({ createdAt: -1 })
        .limit(10)
        .select('_id price payment_status delivery_status createdAt');

      responseReturn(res, 200, {
        todaySales: todaySales.length > 0 ? todaySales[0] : { totalSales: 0, orderCount: 0 },
        hourlySales,
        recentActivity
      });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };
}

export default new DashboardController();
