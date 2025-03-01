import sellerModel from "../../models/sellerModel.js";
import stripeModel from "../../models/stripeModel.js";
import sellerWallet from "../../models/sellerWallet.js";
import withdrowRequest from "../../models/withdrowRequest.js";

import { v4 as uuidv4 } from "uuid";
import { responseReturn } from "../../utiles/response.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const { ObjectId } = mongoose.mongo;
const stripe = new Stripe("sk_test_51Oml5cGAwoXiNtjJZbPFBKav0pyrR8GSwzUaLHLhInsyeCa4HI8kKf2IcNeUXc8jc8XVzBJyqjKnDLX9MlRjohrL003UDGPZgQ");

class PaymentController {
    create_stripe_connect_account = async (req, res) => {
        const { id } = req;
        const uid = uuidv4();

        try {
            const stripeInfo = await stripeModel.findOne({ sellerId: id });

            if (stripeInfo) {
                await stripeModel.deleteOne({ sellerId: id });
            }

            const account = await stripe.accounts.create({ type: "express" });

            const accountLink = await stripe.accountLinks.create({
                account: account.id,
                refresh_url: "http://localhost:3001/refresh",
                return_url: `http://localhost:3001/success?activeCode=${uid}`,
                type: "account_onboarding",
            });

            await stripeModel.create({
                sellerId: id,
                stripeId: account.id,
                code: uid,
            });

            responseReturn(res, 201, { url: accountLink.url });
        } catch (error) {
            console.log("Stripe connect account error: " + error.message);
        }
    };

    active_stripe_connect_account = async (req, res) => {
        const { activeCode } = req.params;
        const { id } = req;

        try {
            const userStripeInfo = await stripeModel.findOne({ code: activeCode });

            if (userStripeInfo) {
                await sellerModel.findByIdAndUpdate(id, { payment: "active" });
                responseReturn(res, 200, { message: "Payment Active" });
            } else {
                responseReturn(res, 404, { message: "Payment Activation Failed" });
            }
        } catch (error) {
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };

    sumAmount = (data) => {
        return data.reduce((sum, item) => sum + item.amount, 0);
    };

    get_seller_payment_details = async (req, res) => {
        const { sellerId } = req.params;

        try {
            const payments = await sellerWallet.find({ sellerId });

            const pendingWithdrawals = await withdrowRequest.find({
                sellerId,
                status: "pending",
            });

            const successfulWithdrawals = await withdrowRequest.find({
                sellerId,
                status: "success",
            });

            const pendingAmount = this.sumAmount(pendingWithdrawals);
            const withdrawnAmount = this.sumAmount(successfulWithdrawals);
            const totalAmount = this.sumAmount(payments);

            let availableAmount = totalAmount - (pendingAmount + withdrawnAmount);

            responseReturn(res, 200, {
                totalAmount,
                pendingAmount,
                withdrawnAmount,
                availableAmount,
                pendingWithdrawals,
                successfulWithdrawals,
            });
        } catch (error) {
            console.log(error.message);
        }
    };

    withdrawal_request = async (req, res) => {
        const { amount, sellerId } = req.body;

        try {
            const withdrawal = await withdrowRequest.create({
                sellerId,
                amount: parseInt(amount),
            });
            responseReturn(res, 200, { withdrawal, message: "Withdrawal Request Sent" });
        } catch (error) {
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };

    get_payment_request = async (req, res) => {
        try {
            const withdrawalRequests = await withdrowRequest.find({ status: "pending" });
            responseReturn(res, 200, { withdrawalRequests });
        } catch (error) {
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };

    payment_request_confirm = async (req, res) => {
        const { paymentId } = req.body;
        try {
            const payment = await withdrowRequest.findById(paymentId);
            const { stripeId } = await stripeModel.findOne({ sellerId: new ObjectId(payment.sellerId) });

            await stripe.transfers.create({
                amount: payment.amount * 100,
                currency: "usd",
                destination: stripeId,
            });

            await withdrowRequest.findByIdAndUpdate(paymentId, { status: "success" });
            responseReturn(res, 200, { payment, message: "Request Confirmed Successfully" });
        } catch (error) {
            responseReturn(res, 500, { message: "Internal Server Error" });
        }
    };
}

export default new PaymentController();
 