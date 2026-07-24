const notificationQueue = require("../queues/notificationQueue");

const addNotificationJob = async (notificationId) => {
    console.log("Adding Job:", notificationId);

    const job = await notificationQueue.add(
        "send-notification",
        { notificationId },
        {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 5000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        }
    );

    console.log("Job Created:", job.id);
    const counts = await notificationQueue.getJobCounts();
    console.log(counts);
};

module.exports = { addNotificationJob };