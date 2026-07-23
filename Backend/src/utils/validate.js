const validator = require("validator");

const validate = (data) => {
    const { name, emailId, password } = data;

    // Check required fields
    if (!name || !emailId || !password) {
        throw new Error("All fields are required.");
    }

    // Name validation
    if (name.trim().length < 2 || name.trim().length > 50) {
        throw new Error("Name must be between 2 and 50 characters.");
    }

    // Email validation
    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address.");
    }

    // Password validation
    if (!validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })) {
        throw new Error(
            "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character."
        );
    }
};

module.exports =  validate;
