const jwt = require("jsonwebtoken");

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

exports.CheckOTPVerification = (req, res, next) => {

    let authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("bearer ")) {
        let token = authHeader.split(" ")[1];
        try {
            let user = jwt.verify(token, process.env.SIGNING_KEY_OTP)
            req.user = user
            next()
        } catch (err) {
            res.status(401).send("Invalid token");
        }
        jwt.verify(token, process.env.SIGNING_KEY_OTP)
    }
    else {
        res.status(401).send("Only logged in users can access this route");
    }
}