// backend/src/controllers/user.controllers.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; // default import now works

/* ================= helpers ================= */

function signToken(user) {
  const payload = { id: user._id, role: user.role };
  const secret = process.env.JWT_SECRET || "dev-secret";
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

function toSafeUser(u) {
  if (!u) return null;
  return {
    id: u._id,
    username: u.username,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt,
    updatedAt: u.updatedAt,
  };
}

/* ================= controllers ================= */

/**
 * POST /api/v1/user/register
 * Body: { username, email, password, role? }
 * Returns 201 + { success: true } so FE redirects to /login
 */
export const register = async (req, res) => {
  try {
    const { username = "", email = "", password = "", role = "user" } = req.body || {};

    if (!username.trim() || !email.trim() || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already in use" });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username.trim(),
      email: email.toLowerCase(),
      password: hash,
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. Please sign in.",
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ success: false, message: "Registration failed" });
  }
};

/**
 * POST /api/v1/user/login
 * Body: { email, password, role }
 */
export const login = async (req, res) => {
  try {
    const { email = "", password = "", role } = req.body || {};
    if (!email.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    if (role && role !== user.role) {
      return res.status(403).json({
        success: false,
        message: "Role mismatch. Please choose the correct role.",
      });
    }

    const token = signToken(user);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

/**
 * POST /api/v1/user/logout
 */
export const logout = async (_req, res) => {
  try {
    // If you used cookies for auth, you could clear them:
    // res.clearCookie("token");
    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return res.status(500).json({ success: false, message: "Logout failed" });
  }
};

/**
 * GET /api/v1/user/me
 */
export const me = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const user = await User.findById(userId);
    return res.status(200).json({ success: true, user: toSafeUser(user) });
  } catch (err) {
    console.error("ME ERROR:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch profile" });
  }
};

/**
 * PATCH /api/v1/user/profile (optional)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { username, role } = req.body || {};
    const updates = {};
    if (typeof username === "string" && username.trim()) updates.username = username.trim();
    if (role && (role === "admin" || role === "user")) updates.role = role;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    return res.status(200).json({
      success: true,
      message: "Profile updated",
      user: toSafeUser(user),
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ success: false, message: "Failed to update profile" });
  }
};