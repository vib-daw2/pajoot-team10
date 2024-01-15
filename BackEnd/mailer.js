const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASSWORD
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Verification failed:", error);
    } else {
        console.log("Server is ready to take our messages");
    }
});

module.exports = transporter;