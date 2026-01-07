const express = require("express");
const UserController = require("../controllers/user-controller");
const auth = require("../middleware/auth-validation");
const userRouter = express.Router();

userRouter.post("/sign-up", UserController.createUser);
userRouter.post("/login", UserController.logUserIn);
userRouter.post("/generate-otp", UserController.generateOTP);
userRouter.post("/verify-otp", UserController.verifyOTP);
userRouter.post("/reset-password", auth.CheckOTPVerification, UserController.resetPassword);

module.exports = userRouter