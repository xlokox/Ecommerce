import customerModel from '../../models/customerModel.js';
import { responseReturn } from '../../utiles/response.js';
import bcrypt from 'bcrypt';
import sellerCustomerModel from '../../models/chat/sellerCustomerModel.js';
import { createToken } from '../../utiles/tokenCreate.js';

class CustomerAuthController {
  customer_register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
      const existingCustomer = await customerModel.findOne({ email });

      if (existingCustomer) {
        return responseReturn(res, 400, { error: 'Email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newCustomer = await customerModel.create({
        name: name.trim(),
        email: email.trim(),
        password: hashedPassword,
        method: 'manual'
      });

      await sellerCustomerModel.create({
        myId: newCustomer.id
      });

      const token = createToken({
        id: newCustomer.id,
        name: newCustomer.name,
        email: newCustomer.email,
        method: newCustomer.method
      });

      res.cookie('customerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      responseReturn(res, 201, { message: 'User registered successfully', token });

    } catch (error) {
      console.error('Registration Error:', error);
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  customer_login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const customer = await customerModel.findOne({ email }).select('+password');

      if (!customer) {
        return responseReturn(res, 404, { error: 'Email not found' });
      }

      const isPasswordValid = await bcrypt.compare(password, customer.password);

      if (!isPasswordValid) {
        return responseReturn(res, 401, { error: 'Incorrect password' });
      }

      const token = createToken({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        method: customer.method
      });

      res.cookie('customerToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });

      responseReturn(res, 200, { message: 'Login successful', token });

    } catch (error) {
      console.error('Login Error:', error);
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };

  customer_logout = async (req, res) => {
    try {
      res.clearCookie('customerToken', { httpOnly: true });
      responseReturn(res, 200, { message: 'Logout successful' });
    } catch (error) {
      console.error('Logout Error:', error);
      responseReturn(res, 500, { error: 'Internal Server Error' });
    }
  };
}

export default new CustomerAuthController();
