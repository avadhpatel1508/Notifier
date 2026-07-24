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
const login  = async(req, res)=>{
    try{
        const {emailId, password}= req.body;
        const isExist = await User.findOne({emailId});
        if(!isExist) return res.status(409).json({ success: false, message: "Email not registered"});

       
        const user =await  User.findOne({emailId});
        const isMatch = await bcrypt.compare(password, user.password);
         if(!isMatch){
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign( { id: user._id, emailId: user.emailId }, process.env.JWT_SECRET, { expiresIn: "7d" } );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            data: {
                id: user._id,
                name: user.name,
                emailId: user.emailId,
            },
        });

    }
    catch(err){
        res.status(500).json({success: false, message: err.message});
    }
}

const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};
module.exports = {register, login, getMe};