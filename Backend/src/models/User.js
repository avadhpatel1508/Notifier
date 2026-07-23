const mongoose = require('mongoose')

const userSchema=new  mongoose.Schema({
    name:{
        type:String,
        minLength:4,
        maxLength:15,
        required: true,
        unique: true,
        trim: true
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
        trim: true
    }
});

const User= mongoose.model('User', userSchema);

module.exports = User;
