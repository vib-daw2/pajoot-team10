const express = require("express");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const admin = require("firebase-admin");
const multer = require('multer');
const AWS = require('aws-sdk');
const serviceAccount = require("./firebase-adminsdk-credentials.json");
const transporter = require("./utils/mailer");
const {Games} = require('./utils/games');
const {Players} = require('./utils/players');
// Mapa para almacenar las referencias a los temporizadores
const timersMap = new Map();


admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),

  databaseURL: process.env.DATABASE_URL

});

AWS.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  });

const s3 = new AWS.S3();

const upload = multer();

require("dotenv").config();

const app = express();
const port = 3001;
const server = createServer(app);
const io = new Server(server,{
    cors:'*'
});
let games = new Games();
let players = new Players();

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

const emailRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Máximo 10 solicitudes por IP dentro del período de tiempo especificado
    message: "Demasiadas solicitudes para enviar correos electrónicos desde esta IP, por favor intenta más tarde."
  });

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware para servir la documentación Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(cors());
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

/**
 * @swagger
 * /api/send-verification-email:
 *   post:
 *     summary: Send a verification email
 *     description: Send a verification email to the specified email address.
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Email is required
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

app.post("/api/send-verification-email", emailRateLimit, async (req, res) => {
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
 *     description: Verify a verification token for the specified email address.
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
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Email and verification token are required
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             example:
 *               error: Invalid verification token
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

app.post("/api/verify-token", async (req, res) => {
    const userEmail = req.body.email;
    const verificationToken = req.body.verification_token;

    if (!userEmail || !verificationToken) {
        res.status(400).json({ error: 'Email and verification token are required' });
        return;
    }

    try {
        const db = admin.database();
        const verificationTokensRef = db.ref("Verification_tokens");
        const existingTokenSnapshot = await verificationTokensRef.orderByChild("email").equalTo(userEmail).once("value");

        if (!existingTokenSnapshot.exists()) {
            res.status(404).json({ error: 'Invalid verification token' });
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
            res.status(404).json({ error: 'Invalid verification token' });
        }
    } catch (error) {
        console.error(`Error verifying token: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/create-user:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided email, password, and display name.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               user:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: User created successfully
 *               user:
 *                 type: object
 *                 properties:
 *                   email:
 *                     type: string
 *                   displayName:
 *                     type: string
 *                   photoURL:
 *                     type: string
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Missing required fields
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

app.post("/api/create-user" ,upload.single('image'),async (req, res) => {
    const userEmail = req.body.email;
    const userPassword = req.body.password;
    const userDisplayName = req.body.user;
    const userProfileImage = req.file; 

    if (!userEmail || !userPassword || !userDisplayName) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }

    try {
        let photoURL;
        if (userProfileImage){
            // Upload profile image to AWS S3
            const uploadParams = {
                Bucket: 'pajoot',
                Key: `profiles/${userEmail}/${Date.now()}_${userProfileImage.originalname}`,
                Body: userProfileImage.buffer,
                ContentType: userProfileImage.mimetype
            };

            const uploadResult = await s3.upload(uploadParams).promise();
            photoURL = uploadResult.Location;
        }

        const userRecord = await admin.auth().createUser({
            email: userEmail,
            password: userPassword,
            displayName: userDisplayName,
            photoURL: photoURL
        });

        console.log(`Successfully created new user: ${userRecord}`);

        res.json({ message: "User created successfully" , user: userRecord});
    } catch (error) {
        console.error(`Error creating new user: ${error}`);
        res.status(500).json({ error: "Internal server error" });
    }
});

/**
 * @swagger
 * /api/upload-photo:
 *   post:
 *     summary: Upload a photo
 *     description: Upload a photo to AWS S3.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               url: "https://your-bucket.s3.amazonaws.com/profiles/123456789_image.jpg"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: No image provided or email missing
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error while uploading image
 */

app.post("/api/upload-photo", upload.single('image'), async (req, res) => {
    try {
        // Obtener la imagen y el correo electrónico del cuerpo de la solicitud
        const image = req.file;
        const userEmail = req.body.email;

        if (!image || !userEmail) {
            return res.status(400).json({ error: "No image provided or email missing" });
        }

        // Subir la imagen a AWS S3
        const uploadParams = {
            Bucket: 'pajoot',
            Key: `profiles/${userEmail}/${Date.now()}_${image.originalname}`,
            Body: image.buffer,
            ContentType: image.mimetype
        };

        const uploadResult = await s3.upload(uploadParams).promise();

        // Devolver la URL de la imagen subida
        res.json({ url: uploadResult.Location });
    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ error: "Internal server error while uploading image" });
    }
});

//When a connection to server is made from client
io.on('connection', (socket) => {

    socket.on("timeUp", function(data) {
        const parsedData = JSON.parse(data);
        let game = games.games.filter((game) => game.pin == parsedData.pin)[0];
        socket.emit('timeUp',game)

        game.gameData.players.players.forEach((player) => {

            io.to(player.socketId).emit('hostTimeUp', game);
        })
    })

    socket.on("startGame", function(data) {

        const parsedData = JSON.parse(data);

        let game = games.games.filter((game) => game.pin == parsedData.pin)[0];

        game.gameLive = true;

        //get the first question

        let question = game.gameData.questions.shift();

        socket.emit('startGame', question);

        //for each player in the game, emit a startGame event to the player by his socket id
        game.gameData.players.players.forEach((player) => {

            io.to(player.socketId).emit('hostStartGame', question);
        })
    })

    socket.on("cancelGame", function(data) {
        socket.emit()
    })

    socket.on("nextQuestion", function(data) {

        const parsedData = JSON.parse(data);

        let game = games.games.filter((game) => game.pin == parsedData.pin)[0];

        game.gameData.playersAnswered = 0;

        //get the next question

        let question = game.gameData.questions.shift();

        if(question == undefined){
            socket.emit('gameOver', game);
            game.gameData.players.players.forEach((player) => {

                io.to(player.socketId).emit('hostGameOver', game);
            })
            return;
        }

        socket.emit('nextQuestion', question, game);
        game.gameData.players.players.forEach((player) => {

            io.to(player.socketId).emit('hostNextQuestion', question);
        })
    })

    socket.on('createGame', async function (data) {
        const parsedData = JSON.parse(data);
        let gamePin = Math.floor(Math.random() * 90000) + 10000;
      
        try {
          // Referencia a la base de datos de Firebase
          const db = admin.database();
          // Obtener referencia a la colección de preguntas
          const preguntasRef = db.ref("preguntas");
      
          const allQuestions = [];
          // Iterar sobre cada temática seleccionada
          for (const tema of parsedData.tematicas) {
            // Obtener referencia a la temática específica dentro de la colección de preguntas
            const tematicaRef = preguntasRef.child(tema);
            // Leer las preguntas desde la base de datos
            const snapshot = await tematicaRef.once("value");
            // Obtener las preguntas de esta temática
            const questions = [];
            snapshot.forEach((childSnapshot) => {
              const question = childSnapshot.val();
              questions.push(question);
            });
            allQuestions.push(...questions);
          }
      
          // Seleccionar 10 preguntas aleatorias de la lista de preguntas
          const selectedQuestions = [];
          for (let i = 0; i < parsedData.numPreguntas; i++) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            selectedQuestions.push(allQuestions.splice(randomIndex, 1)[0]);
          }
      
          // Agregar el juego con las preguntas al objeto de juegos
          let game = games.addGame(gamePin, socket.id, false, parsedData.modoRemoto, parsedData.limiteTiempo, {
            tematicas: parsedData.tematicas,
            questions: selectedQuestions,
            playersAnswered: 0,
            players: new Players(),
          });
      
          // Emitir el juego creado con las preguntas al cliente
          socket.emit('gameCreated', game);
        } catch (error) {
          console.error('Error fetching questions:', error);
          // En caso de error, emitir un mensaje de error al cliente
          socket.emit('gameCreationError', { message: 'Error fetching questions' });
        }
      });

    socket.on("playerJoin", function(data) {
        
        const parsedData = JSON.parse(data);

        let game = games.games.filter((game) => game.pin == parsedData.pin)[0];

        if (!game) {
            // La partida con el código especificado no existe
            console.log('Intento de unirse a una partida inexistente con el código:', parsedData.pin);
            socket.emit('joinError', { message: 'El código de partida no existe' });
            return;
        }

        if(game.gameLive){
            // La partida ya ha comenzado
            console.log('Intento de unirse a una partida en curso con el código:', parsedData.pin);
            socket.emit('joinError', { message: 'Esta partida ya ha comenzado' });
            return;
        }

        game.gameData.players.addPlayer(game.hostId,parsedData.playerId,socket.id,parsedData.playerName,parsedData.photoURL,{score: 0});

        let hostSocket = game.hostId;

        console.log('player joined at game:' + parsedData.pin);
        
        socket.emit('playerJoined', game);
        io.to(hostSocket).emit('updatePlayerBoard',game);
        
    })

    socket.on("answer", function(data) {

        const parsedData = JSON.parse(data);

        let answeredCorrectly = false;

        let game = games.games.filter((game) => game.pin == parsedData.gamePin)[0];

        let player = game.gameData.players.players.filter((player) => player.playerId == parsedData.playerId)[0];


        game.gameData.playersAnswered++;

        let hostSocket = game.hostId;


        io.to(hostSocket).emit('updatePlayersAnswered',game);

        if(parsedData.answer == parsedData.correctAnswer){
            player.gameData.score += (100+(parsedData.timeLeft/300))*parsedData.racha;
            console.log('multiplicador usado: '+parsedData.racha);
            console.log('player '+parsedData.playerId+' answered correctly, score:'+player.gameData.score);
            answeredCorrectly = true;
            socket.emit('questionAnswered', answeredCorrectly);
            return;
        }

        socket.emit('questionAnswered', answeredCorrectly);
        
    })

    socket.on("closeGame", function(data) {
        const parsedData = JSON.parse(data);
        let game = games.removeGame(parsedData.pin);
        game.gameData.players.players.forEach((player) => {
            io.to(player.socketId).emit('hostCloseGame');
        })
    })

    socket.on('disconnect', () => {
        // Verificar si el socket desconectado es el host de alguna partida
        const gameWithDisconnectedHost = games.games.find(game => game.hostId === socket.id,);
        
        if (gameWithDisconnectedHost) {
            // Emitir evento de cancelación de juego a todos los jugadores
            gameWithDisconnectedHost.gameData.players.players.forEach((player) => {
                io.to(player.socketId).emit('hostCloseGame');
            })
            
            // Eliminar el juego de la lista de juegos
            games.removeGame(gameWithDisconnectedHost.pin);

            console.log(games.games)
            
            console.log(`Game with PIN ${gameWithDisconnectedHost.pin} cancelled due to host disconnection.`);
        }
    });
    

});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
