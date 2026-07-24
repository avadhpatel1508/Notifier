require("dotenv").config();

const db = require("../config/db");

;(async () => {
    await db();

    const { Worker } = require("bullmq");
    const connection = require("../config/redis");
    const Notification = require("../models/Notification");
    const ConsoleProvider = require("../providers/ConsoleProvider");

    const worker = new Worker(
        "notificationQueue",
        async (job) => {
            console.log("Job Received:", job.data);

            const notification = await Notification.findById(
                job.data.notificationId
            );

            if (!notification) {
                throw new Error("Invalid notification");
            }

            try {
                notification.attempts += 1;
                notification.status = "processing";
                await notification.save();

                await ConsoleProvider.send(notification);

                notification.status = "sent";
                await notification.save();

                console.log(`Notification ${notification._id} sent`);
            } catch (err) {
                notification.status = "failed";
                await notification.save();
                throw err;
            }
        },
        { connection }
    );

    console.log("Notification Worker Started");
})();