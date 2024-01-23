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
// Mapa para almacenar las referencias a los temporizadores
const timersMap = new Map();


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
// ToDo: Ajustar tamaño logo en desktop/mobile
async function sendVerificationEmail(email, token) {
    let mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: "Codi de verificació",
        text: "",
        html: `
        <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
        <div style='margin:50px auto;width:400px;padding:20px 0'>
            <div style='border-bottom:1px solid #eee;display:flex;justify-content:center'>
                <a href='' style='margin:0 auto'><img src="https://i.ibb.co/Wx3gTMF/logo-pajoot.png" style='height:auto;width:280px;'></a>
            </div>
            <p style='font-size:1.1em;color:#000;margin-left:20px'>Holi,</p>
            <p style='font-size:1.1em;color:#000;margin-left:20px'>Gràcies per escollir Pajoot.<br>Utilitza el següent codi per completar l'accés.<br>Aquest codi serà vàlid durant 15 minuts.</p>
            <h2 style='background:#1688A1;margin:0 auto;width: max-content;padding:6px 18px;color: #fff;border-radius: 4px;'>${token}</h2>
            <p style='font-size:1.1em;color:#000;margin-left:20px'>Atentament,<br>l'equip de Pajoot.</p> <hr style='border:none;border-top:1px solid #eee' />
            <div style='padding:8px 0;color:#aaa;font-size:0.9em;line-height:1;font-weight:300'>
                <p style='margin-left:20px'>Ins (ViB) Dpt Pajoot</p>
                <p style='margin-left:20px'>Rambla President Lluís Companys, 3</p>
                <p style='margin-left:20px'>43005 Tarragona</p>
            </div>
        </div>
        </div>
        `
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

// ...

app.post("/api/send-verification-email", async (req, res) => {
    const userEmail = req.body.email;

    try {
        const userRecord = await admin.auth().getUserByEmail(userEmail);
        if (userRecord) {
            // El correo electrónico ya está registrado, devolver un error
            res.status(400).json({ error: 'Email is already registered' });
            return;
        }
    } catch (authError) {
        // Si hay un error, seguir con el proceso de envío del correo de verificación
    }
    
    // Generar el token de verificación
    const verificationToken = Math.floor(100000 + Math.random() * 900000);

    const db = admin.database();
    const verificationTokensRef = db.ref("Verification_tokens");

    let existingTokenKey;

    try {
        // Verificar si ya existe un registro para el correo electrónico
        const existingTokenSnapshot = await verificationTokensRef.orderByChild("email").equalTo(userEmail).once("value");

        if (existingTokenSnapshot.exists()) {
            // Si ya existe, actualizar el token existente
            existingTokenKey = Object.keys(existingTokenSnapshot.val())[0];
            const updateData = {
                verification_token: verificationToken.toString()
            };
            await verificationTokensRef.child(existingTokenKey).update(updateData);
        } else {
            // Si no existe, crear un nuevo registro
            const verificationData = {
                email: userEmail,
                verification_token: verificationToken.toString()
            };
            const newTokenSnapshot = await verificationTokensRef.push(verificationData);
            existingTokenKey = newTokenSnapshot.key;
            console.log(`New verification token added for email: ${userEmail}`);
        }

        // Enviar el correo electrónico
        await sendVerificationEmail(userEmail, verificationToken);

        // Cancelar el temporizador existente, si hay alguno
        if (timersMap.has(userEmail) && timersMap.get(userEmail).length > 0) {
            const existingTimeouts = timersMap.get(userEmail);
            existingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            timersMap.set(userEmail, []);
        }

        // Programar la eliminación del registro después de 1 minuto
        const timeoutId = setTimeout(async () => {
            try {
                await verificationTokensRef.child(existingTokenKey).remove();
                console.log(`Verification token removed after 15 minutes for email: ${userEmail}`);
            } catch (error) {
                console.error(`Error removing verification token: ${error}`);
            }
        }, 900000); // 15 minutos en milisegundos

        // Respuesta exitosa
        res.json({ message: "Email sent successfully" });

        // Almacenar la referencia del temporizador asociada al correo electrónico
        if (!timersMap.has(userEmail)) {
            timersMap.set(userEmail, []);
        }
        timersMap.get(userEmail).push(timeoutId);
    } catch (error) {
        console.error(`Error processing verification email: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});


server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
