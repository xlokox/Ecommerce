import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    method: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default model("customers", customerSchema);
