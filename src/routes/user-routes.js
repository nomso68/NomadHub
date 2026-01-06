const express = require("express");
const UserController = require("../controllers/user-controller");

const userRouter = express.Router();

userRouter.post("/sign-up", UserController.createUser);
userRouter.post("/login", UserController.logUserIn);

module.exports = userRouter