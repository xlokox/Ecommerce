import adminModel from '../models/adminModel.js';
import sellerModel from '../models/sellerModel.js';
import sellerCustomerModel from '../models/chat/sellerCustomerModel.js';
import { responseReturn } from '../utiles/response.js';
import bcrypt from 'bcrypt';
import { createToken } from '../utiles/tokenCreate.js';
import cloudinary from 'cloudinary';
import formidable from 'formidable';

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.cloud_name,
  api_key: process.env.CLOUDINARY_API_KEY || process.env.api_key,
  api_secret: process.env.CLOUDINARY_API_SECRET || process.env.api_secret,
  secure: true
});

class AuthControllers {
  // 🔹 כניסת אדמין
  async admin_login(req, res) {
    const { email, password } = req.body;
    try {
      const admin = await adminModel.findOne({ email }).select('+password');
      if (!admin) {
        return responseReturn(res, 404, { error: "Admin Email not Found" });
      }
      const match = await bcrypt.compare(password, admin.password);
      if (!match) {
        return responseReturn(res, 401, { error: "Incorrect Password" });
      }
      const token = createToken({ id: admin.id, role: admin.role });
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      return responseReturn(res, 200, { token, message: "Login Success" });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  }

  // 🔹 כניסת מוכר
  async seller_login(req, res) {
    const { email, password } = req.body;
    try {
      const seller = await sellerModel.findOne({ email }).select('+password');
      if (!seller) {
        return responseReturn(res, 404, { error: "Email not Found" });
      }
      const match = await bcrypt.compare(password, seller.password);
      if (!match) {
        return responseReturn(res, 401, { error: "Incorrect Password" });
      }
      const token = createToken({ id: seller.id, role: seller.role });
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      return responseReturn(res, 200, { token, message: "Login Success" });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  }

  // 🔹 רישום מוכר
  async seller_register(req, res) {
    const { email, name, password } = req.body;
    try {
      const getUser = await sellerModel.findOne({ email });
      if (getUser) {
        return responseReturn(res, 400, { error: 'Email Already Exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const seller = await sellerModel.create({
        name,
        email,
        password: hashedPassword,
        method: 'manual',
        shopInfo: {},
      });
      await sellerCustomerModel.create({ myId: seller.id });
      const token = createToken({ id: seller.id, role: seller.role });
      res.cookie('accessToken', token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      return responseReturn(res, 201, { token, message: 'Register Success' });
    } catch (error) {
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 🔹 קבלת מידע משתמש
  async getUser(req, res) {
    const { id, role } = req;
    try {
      if (role === 'admin') {
        const user = await adminModel.findById(id);
        return responseReturn(res, 200, { userInfo: user });
      } else {
        const seller = await sellerModel.findById(id);
        return responseReturn(res, 200, { userInfo: seller });
      }
    } catch (error) {
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 🔹 העלאת תמונת פרופיל
  async profile_image_upload(req, res) {
    const { id } = req;
    const form = formidable({ multiples: true });

    form.parse(req, async (err, _, files) => {
      if (err) {
        return responseReturn(res, 400, { error: 'Form parse error' });
      }
      const { image } = files;
      if (!image) {
        return responseReturn(res, 400, { error: 'No image file provided' });
      }
      try {
        const result = await cloudinary.v2.uploader.upload(image.filepath, { folder: 'profile' });
        await sellerModel.findByIdAndUpdate(id, { image: result.url });
        const userInfo = await sellerModel.findById(id);
        return responseReturn(res, 201, { message: 'Profile Image Uploaded', userInfo });
      } catch (error) {
        return responseReturn(res, 500, { error: error.message });
      }
    });
  }

  // 🔹 הוספת מידע לפרופיל
  async profile_info_add(req, res) {
    const { id } = req;
    const { fullName, phoneNumber } = req.body;

    if (!fullName || !phoneNumber) {
      return responseReturn(res, 400, { error: 'All fields are required' });
    }

    try {
      await sellerModel.findByIdAndUpdate(id, { fullName, phoneNumber });
      const userInfo = await sellerModel.findById(id);
      return responseReturn(res, 201, { message: 'Profile Info Updated', userInfo });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  }

  // 🔹 שינוי סיסמה
  async change_password(req, res) {
    const { email, old_password, new_password } = req.body;
    try {
      const user = await sellerModel.findOne({ email }).select('+password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(old_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Incorrect old password' });
      }
      user.password = await bcrypt.hash(new_password, 10);
      await user.save();
      return res.json({ message: 'Password changed successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  }

  // 🔹 יציאה (Logout)
  async logout(req, res) {
    try {
      res.cookie('accessToken', '', {
        expires: new Date(0),
        httpOnly: true,
      });
      return responseReturn(res, 200, { message: 'Logout Success' });
    } catch (error) {
      return responseReturn(res, 500, { error: error.message });
    }
  }
}

export default new AuthControllers();
