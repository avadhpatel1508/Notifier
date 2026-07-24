require("dotenv").config();

const db = require("../config/db");

;(async () => {
    await db();

    const { Worker } = require("bullmq");
    const connection = require("../config/redis");
    const Notification = require("../models/Notification");
    const ProviderFactory = require('../providers/ProviderFactory');


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

                const provider = ProviderFactory.getProvider(notification.channel);
                await provider.send(notification);

                notification.status = "sent";
                await notification.save();

                console.log(`Notification ${notification._id} sent`);
            } catch (err) {
                notification.attempts += 1;
                await notification.save();
                console.log(job.attemptsMade);
                throw err;
            }
        },
        { connection }
    );

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });

    worker.on("failed", (job, err) => {
        console.log( `Job ${job.id} failed (${job.attemptsMade}/${job.opts.attempts}): ${err.message}`);
    });

   
})();