import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ msg: "User already exists" });

        const hashed = await bcrypt.hash(password,10);
        const user = await User.create({ name, email, password: hashed });

        const html = `
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for registering with us </p>
        `;
        await sendEmail(email, "Welcome to Our App!", html);

        res.status(201).json({ msg: "User registered and email sent", user });
    }   catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const forgotPassword = async (req,res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
    });

    user.resetToken = token;
    await user.save();

    const resetLink = `http://localhost:3000/api/users/reset-password/${token}`;
    const html = `
        <p>Hello ${user.name},</p>
        <p>Click below to reset your password: </p>
        <a href="${resetLink}">${resetLink}</a>
    `;

    await sendEmail(user.email, "Password Reset Request", html);

    res.json({ msg: "Password reset email sent" });
};

export const resetPassword = async (req,res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) return res.status(400).json({ msg: "Invalid token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = null;
        await user.save();

        res.json({ msg: "Password reset successful" });
    }   catch (err) {
        res.status(400).json({ msg: "Invalid or expired token" });
    }
};
