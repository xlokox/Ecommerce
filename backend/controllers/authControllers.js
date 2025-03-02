import adminModel from '../models/adminModel.js';
import sellerModel from '../models/sellerModel.js';
import sellerCustomerModel from '../models/chat/sellerCustomerModel.js';
import { responseReturn } from '../utiles/response.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utiles/tokenCreate.js';
import cloudinary from 'cloudinary';
import formidable from 'formidable';

cloudinary.v2.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
  secure: true,
});

class AuthControllers {
  // כניסת אדמין
  admin_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select('+password');
      if (admin) {
        const match = await bcrypt.compare(password, admin.password);
        if (match) {
          const token = createToken({ id: admin.id, role: admin.role });
          res.cookie('accessToken', token, {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
          responseReturn(res, 200, { token, message: "Login Success" });
        } else {
          responseReturn(res, 404, { error: "Password Wrong" });
        }
      } else {
        responseReturn(res, 404, { error: "Email not Found" });
      }
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // כניסת מוכר – כאן הפונקציה נקראת customer_login אך בפועל היא מאמתת מוכר
  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select('+password');
      if (!seller) {
        return responseReturn(res, 404, { error: "Email not Found" });
      }
      const match = await bcrypt.compare(password, seller.password);
      if (!match) {
        return responseReturn(res, 404, { error: "Password Wrong" });
      }
      const token = createToken({ id: seller.id, role: seller.role });
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      responseReturn(res, 200, { token, message: "Login Success" });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // רישום מוכר – כאן הפונקציה נקראת customer_register אך בפועל היא יוצרת משתמש (מוכר)
  customer_register = async (req, res) => {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        return responseReturn(res, 404, { error: 'Email Already Exist' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const seller = await sellerModel.create({
        name,
        email,
        password: hashed,
        method: 'manual',
        shopInfo: {},
      });
      await sellerCustomerModel.create({ myId: seller.id });
      const token = createToken({ id: seller.id, role: seller.role });
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      responseReturn(res, 201, { token, message: 'Register Success' });
    } catch (error) {
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  // קבלת מידע משתמש (אדמין/מוכר)
  getUser = async (req, res) => {
    const { id, role } = req;
    try {
      if (role === 'admin') {
        const user = await adminModel.findById(id);
        responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  // העלאת תמונת פרופיל
  profile_image_upload = async (req, res) => {
    const { id } = req;
    const form = formidable({ multiples: true });
    form.parse(req, async (err, _, files) => {
      if (err) {
        return responseReturn(res, 400, { error: 'Form parse error' });
      }
      const { image } = files;
      try {
        const result = await cloudinary.v2.uploader.upload(image.filepath, { folder: 'profile' });
        if (result) {
          await sellerModel.findByIdAndUpdate(id, { image: result.url });
          const userInfo = await sellerModel.findById(id);
          responseReturn(res, 201, { message: 'Profile Image Upload Successfully', userInfo });
        } else {
          responseReturn(res, 404, { error: 'Image Upload Failed' });
        }
      } catch (error) {
        responseReturn(res, 500, { error: error.message });
      }
    });
  };

  // הוספת מידע לחנות (כתובת וכו')
  profile_info_add = async (req, res) => {
    const { division, district, shopName, sub_district } = req.body;
    const { id } = req;
    try {
      await sellerModel.findByIdAndUpdate(id, {
        shopInfo: { shopName, division, district, sub_district }
      });
      const userInfo = await sellerModel.findById(id);
      responseReturn(res, 201, { message: 'Profile info Add Successfully', userInfo });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // יציאה (מחיקת העוגייה)
  logout = async (req, res) => {
    try {
      res.cookie('accessToken', null, {
        expires: new Date(Date.now()),
        httpOnly: true
      });
      responseReturn(res, 200, { message: 'logout Success' });
    } catch (error) {
      responseReturn(res, 500, { error: error.message });
    }
  };

  // שינוי סיסמה
  change_password = async (req, res) => {
    const { email, old_password, new_password } = req.body;
    try {
      const user = await sellerModel.findOne({ email }).select('+password');
      if (!user) return res.status(404).json({ message: 'User not found' });
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Incorrect old password' });
      user.password = await bcrypt.hash(new_password, 10);
      await user.save();
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server Error' });
    }
  };
}

export default new AuthControllers();
