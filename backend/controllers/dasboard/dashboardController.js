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
      responseReturn(res, 200, {
        totalProduct,
        totalOrder,
        totalSeller,
        messages,
        recentOrders,
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  get_seller_dashboard_data = async (req, res) => {
    const { id } = req;
    try {
      const totalSale = await sellerWallet.aggregate([
        {
          $match: { 
            sellerId: { $eq: id }
          }
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" }
          }
        }
      ]);
      const totalProduct = await productModel.find({ sellerId: new ObjectId(id) }).countDocuments();
      const totalOrder = await authOrder.find({ sellerId: new ObjectId(id) }).countDocuments();
      const totalPendingOrder = await authOrder.find({
        $and: [
          { sellerId: { $eq: new ObjectId(id) } },
          { delivery_status: { $eq: "pending" } }
        ]
      }).countDocuments();
      const messages = await sellerCustomerMessage.find({
        $or: [
          { senderId: { $eq: id } },
          { receverId: { $eq: id } }
        ]
      }).limit(3);
      const recentOrders = await authOrder.find({ sellerId: new ObjectId(id) }).limit(5);
      responseReturn(res, 200, {
        totalProduct,
        totalOrder,
        totalPendingOrder,
        messages,
        recentOrders,
        totalSale: totalSale.length > 0 ? totalSale[0].totalAmount : 0
      });
    } catch (error) {
      console.log(error.message);
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
}

export default new DashboardController();
