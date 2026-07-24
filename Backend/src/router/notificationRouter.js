const express = require('express');
const {createNotificaiton, ListNotifications, getNotification} = require('../controllers/notificationController');
const userMMiddleware = require('../middleware/userMiddleware');

const notificationRouter = express.Router();

notificationRouter.post("/create", userMMiddleware, createNotificaiton);
notificationRouter.get("/", userMMiddleware,  ListNotifications);
notificationRouter.get("/:id", userMMiddleware, getNotification);


module.exports = notificationRouter;