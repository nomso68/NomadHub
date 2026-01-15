const jwt = require("jsonwebtoken");
const OtpToken = require("../models/otpToken");

exports.CheckUserLoginStatus = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("bearer ")) {
        let token = authHeader.split(" ")[1];
        try {
            let user = jwt.verify(token, process.env.SIGNING_KEY)
            req.user = user
            next()
        } catch (err) {
            res.status(401).send("Invalid token");
        }
        jwt.verify(token, process.env.SIGNING_KEY)
    }
    else {
        res.status(401).send("Only logged in users can access this route");
    }
}

exports.CheckOTPVerification = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("No authorization header found");
            return res.status(401).send("Authorization token required");
        }

        const token = authHeader.split(" ")[1];

        console.log("Verifying token", token);

        // verify signature & expiry
        const decoded = jwt.verify(token, process.env.SIGNING_KEY_OTP);

        console.log("Token verified successfully", decoded);

        // 🔐 enforce single-use
        const record = await OtpToken.findOne({ jti: decoded.jti });

        if (!record || record.used) {
            console.log("Token already used or invalid");
            return res.status(401).send("Token already used or invalid");
        }

        // mark token as used
        record.used = true;
        await record.save();

        console.log("Token marked as used successfully");

        req.user = decoded;
        next();
    } catch (err) {
        console.log("Error verifying token", err);
        return res.status(401).send("Invalid or expired token");
    }
}
