const { Queue } = require("bullmq");
const connection = require('../config/redis');
const notificationQueue = new Queue("notificationQueue", {connection,});

module.exports = notificationQueue;