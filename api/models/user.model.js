import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8, 
    },
    contact: {
        type: String,
        validate: {
            validator: function (v) {
                return /^(98|97)\d{8}$/.test(v); 
            },
            message: "Invalid phone number.",
        },
    },
    fullname: {
        type: String,
        required: function () {
            return this.role === 'seller';
          },
    },

    role: {
        type: String,
        enum: ['buyer', 'seller' ,'admin'], // Restricts role to 'buyer' or 'seller'
        default: 'buyer',         // Default role is 'buyer'
    },
    otp: {
        type: String,
        required: false,
    },
    otpExpiresAt: {
        type: Date,
        required: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false, // Initially, email is not verified
    },
    
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;

/*const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    contact: {
      type: String,
      validate: {
        validator: function (v) {
          return /^(98|97)\d{8}$/.test(v);
        },
        message: "Invalid phone number.",
      },
    },
    fullname: {
      type: String,
      required: function () {
        return this.role === 'seller';
      },
    },
    role: {
      type: String,
      enum: ['buyer', 'seller', 'admin'],
      default: 'buyer',
    },
    /*isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
  }, { timestamps: true });
  
  const User = mongoose.model('User', userSchema);
  export default User;*/
  

