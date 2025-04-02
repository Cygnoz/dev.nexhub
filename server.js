require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",");

const server = express();
const organizationRouter = require('./router/organizationRouter');

require('./database/connection/connection');
require("./controller/azure/authController");


server.use(express.json({ limit: '10mb' })); 
server.use(express.urlencoded({ limit: '10mb', extended: true }));


server.use(cors({
    origin: function (origin, callback) {
        if (!origin || process.env.ALLOWED_ORIGINS === "*") {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed from this origin"));
        }
    },
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization"
}));


// Handle CORS preflight requests safely
server.options('*', (req, res) => {
    const origin = req.headers.origin;
    if (!origin || allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }
    res.sendStatus(200);
});

server.use(helmet()); 
server.use(organizationRouter);


// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Promise Rejection:", reason);
});


// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    process.exit(1); // Optionally restart the server
});


// General error handling middleware
server.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const PORT = process.env.PORT || 7004;

server.get('/', (req, res) => {
    res.status(200).json("Dev NexHub server started - Organization v10");
});

server.listen(PORT, () => {
    console.log(`NexHub server Organization started at port : ${PORT}`);
});
