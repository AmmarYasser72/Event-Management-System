import express from "express";
import { login, logout, register, me, updateProfile } from "../controllers/user.controllers.js";
import { requireAuth } from "../middleware/requireAuth.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

// NEW:
userRouter.get("/me", requireAuth, me);
userRouter.patch("/profile", requireAuth, updateProfile);

export default userRouter;
