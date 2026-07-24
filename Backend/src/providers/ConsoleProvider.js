const ConsoleProvider = {
    async send(notification) {
        console.log("==================================");
        console.log("Sending Notification");
        console.log("ID      :", notification._id);
        console.log("Channel :", notification.channel);
        console.log("Title   :", notification.title);
        console.log("Message :", notification.message);
        console.log("To      :", notification.recipient);
        console.log("==================================");

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        return {
            success: true,
            provider: "console",
            messageId: notification._id.toString(),
        };
    },
};

module.exports = ConsoleProvider;