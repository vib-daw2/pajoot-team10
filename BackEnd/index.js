const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const nodemailer = require("nodemailer");
const transporter = require("./mailer");
require("dotenv").config();

const app = express();
const port = 3001;
const server = createServer(app);
const io = new Server(server);

app.use(cors());
app.use(express.static("public"));

io.on("connection", (socket) => {
    console.log("A user connected");
});

async function sendEmail() {

    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER,
        subject: "User Connected",
        text: "A user has connected to the server."
    };

    // Send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    sendEmail();
});
