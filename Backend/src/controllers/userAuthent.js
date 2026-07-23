require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require('../models/User');
const validate = require('../utils/validate');
const register = async(req, res)=>{
    try {
        const{ name, emailId, password}=req.body;
        validate(req.body);
        const existingUser = await User.findOne({emailId});

        if (existingUser) 
            return res.status(409).json({ success: false, message: "Email already registered"});
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({name,emailId, password:hashedPassword});

        const token = jwt.sign( { id: user._id, emailId: user.emailId }, process.env.JWT_SECRET, { expiresIn: "7d" } );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            data: {
                id: user._id,
                name: user.name,
                emailId: user.emailId,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message,});
    }
}

module.exports = {register};