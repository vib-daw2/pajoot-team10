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
        subject: "Código de verificación",
        text: "",
        html: `
        <div style='font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2'>
            <div style='width:60%'>
                <div style='margin:50px auto;width:400px;padding:20px 0'>
                    <div style='border-bottom:1px solid #eee;display:flex;justify-content:center'>
                        <a href='' style='margin:0 auto'><img src="https://i.ibb.co/n8bPt5R/Logo-Sombra.png" style='height:auto;width:280px;'></a>
                    </div>
                    <p style='font-size:1.1em;color:#000;margin-left:20px'>Holi,</p>
                    <p style='font-size:1.1em;color:#000;margin-left:20px'>Gracias por escoger Pajoot.<br>Utiliza el siguiente código para completar el registro.<br>Este coódigo será válido durante 15 minutos.</p>
                    <h2 style='background:#1688A1;margin:0 auto;width: max-content;padding:6px 18px;color: #fff;border-radius: 4px;'>${token}</h2>
                    <p style='font-size:1.1em;color:#000;margin-left:20px'>Atentamente,<br>el equipo de Pajoot.</p> <hr style='border:none;border-top:1px solid #eee' />
                    <div style='padding:8px 0;color:#aaa;font-size:0.9em;line-height:1;font-weight:300'>
                        <p style='margin-left:20px'>Ins (ViB) Dpt Pajoot</p>
                        <p style='margin-left:20px'>Rambla President Lluís Companys, 3</p>
                        <p style='margin-left:20px'>43005 Tarragona</p>
                    </div>
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

app.post("/api/send-verification-email", async (req, res) => {
    const userEmail = req.body.email;

    if (!userEmail) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

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

/**
 * @swagger
 * /api/verify-token:
 *   post:
 *     summary: Verify a verification token
 *     description: Verify a verification token for the specified email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               verification_token:
 *                 type: string
 *             example:
 *               email: "example@example.com"
 *               verification_token: "123456"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Verification successful
 */
app.post("/api/verify-token", async (req, res) => {
    const userEmail = req.body.email;
    const verificationToken = req.body.verification_token;

    if (!userEmail) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    if (!verificationToken) {
        res.status(400).json({ error: 'Verification token is required' });
        return;
    }

    try {
        const db = admin.database();
        const verificationTokensRef = db.ref("Verification_tokens");
        const existingTokenSnapshot = await verificationTokensRef.orderByChild("email").equalTo(userEmail).once("value");

        if (!existingTokenSnapshot.exists()) {
            res.status(400).json({ error: 'Invalid verification token' });
            return;
        }

        const tokenKey = Object.keys(existingTokenSnapshot.val())[0];
        const tokenData = existingTokenSnapshot.val()[tokenKey];

        if (tokenData.verification_token === verificationToken) {
            // Eliminar el registro de la base de datos
            await verificationTokensRef.child(tokenKey).remove();
            console.log(`Verification token removed after successful verification for email: ${userEmail}`);

            // Respuesta exitosa
            res.json({ message: "Verification successful" });
        } else {
            res.status(400).json({ error: 'Invalid verification token' });
        }
    } catch (error) {
        console.error(`Error verifying token: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
}
);


/**
 * @swagger
 * /api/create-user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided email, password, and display name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               user:
 *                 type: string
 *             example:
 *               email: "example@example.com"
 *               password: "password123"
 *               user: "John Doe"
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 */
app.post ("/api/create-user", async (req, res) =>{
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userDisplayName = req.body.user;

    if (!userEmail) {
        res.status(400).json({ error: 'Email is required' });
        return;
    }

    if (!userPassword) {
        res.status(400).json({ error: 'Password is required' });
        return;
    }

    if (!userDisplayName) {
        res.status(400).json({ error: 'Display name is required' });
        return;
    }

    try {
        const userRecord = await admin.auth().createUser({
            email: userEmail,
            password: userPassword,
            displayName: userDisplayName
        });

        console.log(`Successfully created new user: ${userRecord.uid}`);

        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error(`Error creating new user: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});


server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
