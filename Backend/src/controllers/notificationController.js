require("dotenv").config();
const Notification = require("../models/Notification");

const createNotificaiton = async (req, res) => {
    try {
        const {id}= req.user;
        const { recipient, channel, title, message } = req.body;

        if (!recipient || !channel || !title || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        const notification = await Notification.create({
            user: id,
            recipient,
            channel,
            title,
            message,
            status: "queued",
            attempts: 0
        });

        return res.status(201).json({
            success: true,
            message: "Notification created successfully.",
            notification
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const ListNotifications = async (req, res) => {
    try {
        const {id} = req.user;
        const notifications = await Notification.find({
            user: id
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: notifications.length,
            notifications
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};
const getNotification = async (req, res) => {
    try {
        const {id} = req.user;
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: id
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found."
            });
        }

        return res.status(200).json({
            success: true,
            notification
        });

    } catch (err) {

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
};

module.exports = {createNotificaiton, ListNotifications, getNotification};