const nodemailer = require("nodemailer");

const transporter = require('../config/mail');

class EmailProvider {
    static async send(notification) {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: notification.recipient,
            subject: notification.title,
            text: notification.message,
        });

        console.log(`Email sent to ${notification.recipient}`);
    }
}

module.exports = EmailProvider;