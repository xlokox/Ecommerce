// controllers/home/customerAuthController.js
import customerModel from '../../models/customerModel.js';
import { responseReturn } from '../../utiles/response.js';
import bcrypt from 'bcrypt';
import sellerCustomerModel from '../../models/chat/sellerCustomerModel.js';
import { createToken } from '../../utiles/tokenCreate.js';
import formidable from 'formidable';
import cloudinary from 'cloudinary';



class CustomerAuthController {
  constructor() {
    console.log("🔍 פונקציות ב-customerAuthController:");
    console.log("customer_register:", typeof this.customer_register);
    console.log("customer_login:", typeof this.customer_login);
    console.log("customer_logout:", typeof this.customer_logout);
  }

  async customer_register(req, res) {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password) {
        return responseReturn(res, 400, { error: 'All fields are required' });
      }

      // בדיקה אם לקוח כבר רשום
      const existingCustomer = await customerModel.findOne({ email: email.trim() });
      if (existingCustomer) {
        return responseReturn(res, 400, { error: 'Email already exists' });
      }

      // הצפנת סיסמה
      const hashedPassword = await bcrypt.hash(password, 10);

      // יצירת לקוח חדש
      const newCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        method: 'manual'
      });

      // יצירת רשומת צ'אט עבור הלקוח
      await sellerCustomerModel.create({ myId: newCustomer.id });

      // יצירת טוקן עם role = 'customer'
      const token = createToken({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        method: newCustomer.method,
        role: 'customer'
      });

      // הגדרת Cookie (בפיתוח secure יהיה false)
      res.cookie('customerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return responseReturn(res, 201, { message: 'User registered successfully', token });
    } catch (error) {
      console.error('🚨 Registration Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 2️⃣ התחברות לקוח
  async customer_login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return responseReturn(res, 400, { error: 'All fields are required' });
      }

      // בדיקת קיום הלקוח
      const customer = await customerModel.findOne({ email: email.trim() }).select('+password');
      if (!customer) {
        return responseReturn(res, 404, { error: 'Email not found' });
      }

      // בדיקת הסיסמה
      const isPasswordValid = await bcrypt.compare(password, customer.password);
      if (!isPasswordValid) {
        return responseReturn(res, 401, { error: 'Incorrect password' });
      }

      // יצירת טוקן עם role = 'customer'
      const token = createToken({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        method: customer.method,
        role: 'customer'
      });

      res.cookie('customerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      return responseReturn(res, 200, { message: 'Login successful', token });
    } catch (error) {
      console.error('🚨 Login Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 3️⃣ התנתקות
  async customer_logout(req, res) {
    try {
        res.clearCookie('customerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: "None" // ✅ חובה אם משתמשים ב־CORS
        })
        return responseReturn(res, 200, { message: 'Logout successful' })
    } catch (error) {
        console.error('🚨 Logout Error:', error)
        return responseReturn(res, 500, { error: 'Internal Server Error' })
    }
  }

  // 4️⃣ קבלת פרופיל לקוח
  async get_customer_profile(req, res) {
    try {
      const { id } = req;
      const customer = await customerModel.findById(id);
      if (!customer) {
        return responseReturn(res, 404, { error: 'Customer not found' });
      }
      return responseReturn(res, 200, { customer });
    } catch (error) {
      console.error('🚨 Get Profile Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 5️⃣ עדכון פרופיל לקוח
  async update_customer_profile(req, res) {
    try {
      const { id } = req;
      const { name, phone, address } = req.body;

      const updateData = {};
      if (name) updateData.name = name.trim();
      if (phone) updateData.phone = phone.trim();
      if (address) updateData.address = address;

      const customer = await customerModel.findByIdAndUpdate(id, updateData, { new: true });
      if (!customer) {
        return responseReturn(res, 404, { error: 'Customer not found' });
      }

      return responseReturn(res, 200, { message: 'Profile updated successfully', customer });
    } catch (error) {
      console.error('🚨 Update Profile Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

  // 6️⃣ העלאת תמונת פרופיל לקוח
  async upload_customer_image(req, res) {
    try {
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
          const result = await cloudinary.v2.uploader.upload(image.filepath, {
            folder: 'customer_profiles',
            transformation: [
              { width: 300, height: 300, crop: 'fill' },
              { quality: 'auto' }
            ]
          });

          const customer = await customerModel.findByIdAndUpdate(
            id,
            { image: result.url },
            { new: true }
          );

          return responseReturn(res, 200, {
            message: 'Profile image uploaded successfully',
            customer,
            imageUrl: result.url
          });
        } catch (uploadError) {
          console.error('🚨 Image Upload Error:', uploadError);
          return responseReturn(res, 500, { error: 'Image upload failed' });
        }
      });
    } catch (error) {
      console.error('🚨 Upload Image Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }

}

export default new CustomerAuthController();
