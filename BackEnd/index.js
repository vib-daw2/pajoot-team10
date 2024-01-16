const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const transporter = require("./mailer");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-adminsdk-credentials.json");
const { send } = require("process");


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

  databaseURL: process.env.DATABASE_URL

});

require("dotenv").config();

const app = express();
const port = 3001;
const server = createServer(app);
const io = new Server(server);

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pajoot API",
            version: "1.0.0",
            description: "API documentation with Swagger",
        },
    },
    apis: ["./index.js"], // Especifica la ruta donde se encuentran tus rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware para servir la documentación Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

io.on("connection", (socket) => {
    console.log("A user connected");
});

async function sendVerificationEmail(email) {
    const token = Math.floor(100000 + Math.random() * 900000);
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Verification token",
        text: "",
        html: `<div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'> <div style='margin:50px auto;width:70%;padding:20px 0'> <div style='border-bottom:1px solid #eee'> <a href='' style='font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600'>Pajoot</a> </div> <p style='font-size:1.1em'>Hi,</p> <p>Thank you for choosing Pajoot. Use the following OTP to complete your Sign Up procedures. OTP is valid for 15 minutes</p> <h2 style='background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;'>${token}</h2> <p style='font-size:0.9em;'>Regards,<br />Pajoot team</p> <hr style='border:none;border-top:1px solid #eee' /> <div style='float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300'> <p>Pajoot Inc</p> <p>1600 Amphitheatre Parkway</p> <p>California</p> </div> </div> </div> `
    };

    // Send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error(`Error sending email: ${error}`);
    }
}


//PRUEBA DE SWAGGER, IGNORAR

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the server
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: List of users retrieved successfully
 *               users: []
 */
app.get("/api/users", (req, res) => {
    // Tu lógica para obtener la lista de usuarios
    res.json({ message: "List of users retrieved successfully", users: [] });
});

/**
 * @swagger
 * /api/send-verification-email:
 *   post:
 *     summary: Send a verification email
 *     description: Send a verification email to the specified email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             example:
 *               email: "example@example.com"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Email sent successfully
 */

app.post("/api/send-verification-email", (req, res) => {
    sendVerificationEmail(req.body.email);
    res.json({ message: "Email sent successfully" });
});




server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
