const express = require("express");
const authRouter = require('./router/userAuth');
const app = express();

// Middlewares
app.use(express.json());
app.use("/api/auth", authRouter);

// Health Check
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Project Scaffold Engine API is running."
    });
});

// Export app
module.exports = app;