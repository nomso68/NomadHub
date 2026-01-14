const express = require("express");
const LocationController = require("../controllers/location-controller");
const auth = require("../middleware/auth-validation");
const locationRouter = express.Router();

locationRouter.post("/submit-contribution", LocationController.submitContribution);
// locationRouter.post("/login", LocationController.logUserIn);
// locationRouter.post("/generate-otp", LocationController.generateOTP);
// locationRouter.post("/verify-otp", LocationController.verifyOTP);
// locationRouter.post("/reset-password", auth.CheckOTPVerification, LocationController.resetPassword);

module.exports = locationRouter