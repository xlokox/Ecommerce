import sellerModel from '../../models/sellerModel.js';
import customerModel from '../../models/customerModel.js';
import sellerCustomerModel from '../../models/chat/sellerCustomerModel.js';
import sellerCustomerMessage from '../../models/chat/sellerCustomerMessage.js';
import adminSellerMessage from '../../models/chat/adminSellerMessage.js';
import { responseReturn } from '../../utiles/response.js';

class ChatController {
  add_customer_friend = async (req, res) => {
    try {
      const { sellerId, userId } = req.body;
      if (!sellerId || !userId) return responseReturn(res, 400, { error: "Missing sellerId or userId" });

      const seller = await sellerModel.findById(sellerId);
      const user = await customerModel.findById(userId);

      if (!seller || !user) return responseReturn(res, 404, { error: "Seller or User not found" });

      const checkSeller = await sellerCustomerModel.findOne({ myId: userId, 'myFriends.fdId': sellerId });
      if (!checkSeller) {
        await sellerCustomerModel.updateOne(
          { myId: userId },
          { $push: { myFriends: { fdId: sellerId, name: seller.shopInfo?.shopName, image: seller.image || "" } } }
        );
      }

      const checkCustomer = await sellerCustomerModel.findOne({ myId: sellerId, 'myFriends.fdId': userId });
      if (!checkCustomer) {
        await sellerCustomerModel.updateOne(
          { myId: sellerId },
          { $push: { myFriends: { fdId: userId, name: user.name, image: "" } } }
        );
      }

      const messages = await sellerCustomerMessage.find({
        $or: [
          { receverId: sellerId, senderId: userId },
          { receverId: userId, senderId: sellerId }
        ]
      });

      const myFriendsData = await sellerCustomerModel.findOne({ myId: userId });
      const currentFriend = myFriendsData?.myFriends.find(f => f.fdId === sellerId);

      responseReturn(res, 200, { myFriends: myFriendsData?.myFriends || [], currentFriend, messages });
    } catch (error) {
      console.error("Error in add_customer_friend:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  customer_message_add = async (req, res) => {
    try {
      const { userId, text, sellerId, name } = req.body;
      if (!userId || !sellerId || !text || !name) return responseReturn(res, 400, { error: "Missing fields" });

      const message = await sellerCustomerMessage.create({ senderId: userId, senderName: name, receverId: sellerId, message: text });

      await this.updateFriendsOrder(userId, sellerId);
      await this.updateFriendsOrder(sellerId, userId);

      responseReturn(res, 201, { message });
    } catch (error) {
      console.error("Error in customer_message_add:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_customers = async (req, res) => {
    try {
      const { sellerId } = req.params;
      const data = await sellerCustomerModel.findOne({ myId: sellerId });
      responseReturn(res, 200, { customers: data?.myFriends || [] });
    } catch (error) {
      console.error("Error in get_customers:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_customers_seller_message = async (req, res) => {
    try {
      const { customerId } = req.params;
      const { id } = req;
      const messages = await sellerCustomerMessage.find({
        $or: [
          { receverId: customerId, senderId: id },
          { receverId: id, senderId: customerId }
        ]
      });

      const currentCustomer = await customerModel.findById(customerId);
      responseReturn(res, 200, { messages, currentCustomer });
    } catch (error) {
      console.error("Error in get_customers_seller_message:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_sellers = async (req, res) => {
    try {
      const sellers = await sellerModel.find({});
      responseReturn(res, 200, { sellers });
    } catch (error) {
      console.error("Error in get_sellers:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  seller_admin_message_insert = async (req, res) => {
    try {
      const { senderId, receverId, message, senderName } = req.body;
      const messageData = await adminSellerMessage.create({ senderId, receverId, message, senderName });
      responseReturn(res, 200, { message: messageData });
    } catch (error) {
      console.error("Error in seller_admin_message_insert:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_admin_messages = async (req, res) => {
    try {
      const { receverId } = req.params;
      if (!receverId) return responseReturn(res, 400, { error: "Receiver ID is required" });

      const messages = await adminSellerMessage.find({
        $or: [{ receverId, senderId: "" }, { receverId: "", senderId: receverId }]
      });

      const currentSeller = await sellerModel.findById(receverId);
      responseReturn(res, 200, { messages, currentSeller });
    } catch (error) {
      console.error("Error in get_admin_messages:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  get_seller_messages = async (req, res) => {
    try {
      const { id } = req;
      if (!id) return responseReturn(res, 400, { error: "Sender ID is required" });

      const messages = await adminSellerMessage.find({
        $or: [{ receverId: "", senderId: id }, { receverId: id, senderId: "" }]
      });

      responseReturn(res, 200, { messages });
    } catch (error) {
      console.error("Error in get_seller_messages:", error);
      responseReturn(res, 500, { error: "Internal Server Error" });
    }
  };

  updateFriendsOrder = async (userId, friendId) => {
    const data = await sellerCustomerModel.findOne({ myId: userId });
    if (data) {
      let myFriends = data.myFriends;
      let index = myFriends.findIndex(f => f.fdId === friendId);
      if (index > 0) {
        let [movedFriend] = myFriends.splice(index, 1);
        myFriends.unshift(movedFriend);
        await sellerCustomerModel.updateOne({ myId: userId }, { myFriends });
      }
    }
  };
}

console.log("✅ ChatController loaded"); // בדיקה שהקובץ באמת נטען
export default new ChatController();
