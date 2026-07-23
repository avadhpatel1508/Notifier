const express = require('express');
const {register, login, getMe} = require('../controllers/userAuthent');
const userMiddleware = require('../middleware/userMiddleware');


const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/getMe", userMiddleware, getMe);



module.exports = authRouter;