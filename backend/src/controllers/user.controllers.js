import { User } from "../models/user.models.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken"



export const register = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);   // 👈 add this line

    const { username, email, phoneNumber, password, role } = req.body;
    if (!username || !email || !phoneNumber || !role || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
        success: false
      });
    }

    const newUser = await User.create({
      username,
      email,
      phoneNumber,
      password,  // will be hashed by pre-save hook
      role,
    });

    return res.status(201).json({
      message: "Successfully signed up",
      success: true,
      user: newUser
    });
  } catch (error) {
    console.error("Register Error:", error);   
    return res.status(500).json({
      message: "Error in registration",
      error: error.message
    });
  }
};



export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "All fields are required for login",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Password not matched",
                success: false
            });
        }

        if (role !== user.role) {
            return res.status(403).json({
                message: "Account does not exist with current role",
                success: false
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        const userData = {
            _id: user._id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role
        };

        return res.status(200)
            .cookie("token", token, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' })
            .json({
                message: `Welcome back ${user.username}`,
                user: userData,
                token: token,
                success: true
            });

    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({
            message: "Error in user login",
            error: error.message
        });
    }
}



export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", " ", { maxAge: 0 }).json({
            message: "LogOut Successfully",
            success: true
        })
    } catch (error) {
        res.status(500).json({
            message: "Logout Error",
            error: error.message
        })
    }
}
