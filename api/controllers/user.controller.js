import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(errorHandler(401, "You can only update your own account or be an admin!"));
    }
    // Validate fields (e.g., if role is 'seller', validate contact)
    const { username, email, password, role, contact ,fullname} = req.body; 
    if (role === "seller") {
        if (!fullname) {
            return next(errorHandler(400, "Full Name is required for sellers."));
        }
        if (contact && !/^(98|97)\d{8}$/.test(contact)) {
            return next(errorHandler(400, "Invalid Nepalese phone number."));
        }
    }

    if (password && password.length < 8) {
        return next(errorHandler(400, "Password must be at least 8 characters long."));
    }

    // Prepare the data for update
    let updatedData = { username, email, role, contact,fullname };

    // If a new password is provided, include it without hashing
    if (password) {
        updatedData.password = password; // Simply update the password without hashing
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: updatedData,
        }, { new: true });

        const { password, ...rest } = updatedUser._doc; // Exclude password from the response
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json("User not found");

        const { password, ...rest } = user._doc; // Exclude password
        res.status(200).json(rest); // Ensure fullname and contact are included
    } catch (err) {
        next(err);
    }
};


export const deleteUser = async (req, res, next) => {
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
        return next(errorHandler(401, "You can only delete your own account or be an admin!"));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json('User has been deleted!');
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async(req,res,next) =>{
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      }
};