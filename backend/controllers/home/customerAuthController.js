// controllers/home/customerAuthController.js
import customerModel from '../../models/customerModel.js';
import { responseReturn } from '../../utiles/response.js';
import bcrypt from 'bcrypt';
import sellerCustomerModel from '../../models/chat/sellerCustomerModel.js';
import { createToken } from '../../utiles/tokenCreate.js';

class CustomerAuthController {
  // 1️⃣ רישום לקוח
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
      res.clearCookie('customerToken', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
      return responseReturn(res, 200, { message: 'Logout successful' });
    } catch (error) {
      console.error('🚨 Logout Error:', error);
      return responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  }
}

export default new CustomerAuthController();
