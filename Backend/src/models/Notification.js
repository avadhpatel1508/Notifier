const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    recipient: {
        type: String,
        required: true,
        trim: true,
    },

    channel: {
        type: String,
        enum: ["console", "email"],
        default: "console",
    },

    title: {
        type: String,
        required: true,
    },

    message: {
        type: String,
        required: true,
    },

    status: {
        type: String,
        enum: ["pending", "queued", "processing", "sent", "failed", "cancelled"],
        default: "queued",
    },

    attempts: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;