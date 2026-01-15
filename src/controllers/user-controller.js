const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
// const mongoose = require("mongoose");
const { Resend } = require("resend");
const { v4: uuidv4 } = require("uuid");
const OtpToken = require("../models/otpToken");
dotenv.config();
const saltRounds = 10;
const passwordValidator = require("password-validator");

let schema = new passwordValidator();

schema
    .is().min(8)
    .is().max(100)
    .has().uppercase()
    .has().lowercase()
    .has().digits(1)
    .has().symbols()
    .has().not().spaces();

exports.createUser = async (req, res) => {
    try {
        let {
            full_name,
            email,
            password,
            work_type,
            preferred_environment,
            time_zone,
            budget_range,
            interests_and_hobbies,
            languages,
        } = req.body
        if (!schema.validate(password)) {
            return res.status(400).json({
                message: "Password does not meet complexity requirements",
            });
        }
        let hash = await bcrypt.hash(password, saltRounds);
        let newUser = new Users({
            full_name,
            email,
            password: hash,
            work_type,
            preferred_environment,
            time_zone,
            budget_range,
            interests_and_hobbies,
            languages,
            deleted: false
        });
        await newUser.save();
        res.json({
            message: "User added successfully",
            data: {
                newUser: {
                    full_name,
                    email,
                    work_type,
                    preferred_environment,
                    time_zone,
                    budget_range,
                    interests_and_hobbies,
                    languages,
                }
            }
        })
    } catch (error) {
        res.send("An error has occurred")
    }
}

exports.logUserIn = async (req, res) => {
    try {
        let { email, password } = req.body;
        let singleUser = await Users.findOne(
            { email, deleted: { $in: [false, null] } },
            { __v: 0, deleted: 0 }
        );
        if (!singleUser) {
            return res.status(404).send("User not found");
        }
        let isEqual = await bcrypt.compare(password, singleUser.password);
        if (isEqual) {
            let token = jwt.sign({ id: singleUser._id }, process.env.SIGNING_KEY, { expiresIn: "1h" });
            res.json({
                userData: {
                    full_name: singleUser.full_name,
                    email: singleUser.email,
                    work_type: singleUser.work_type,
                    preferred_environment: singleUser.preferred_environment,
                    time_zone: singleUser.time_zone,
                    budget_range: singleUser.budget_range,
                    interests_and_hobbies: singleUser.interests_and_hobbies,
                    languages: singleUser.languages
                },
                token,
            });
        } else {
            return res.status(401).send("User not found");
        }
    } catch (err) {
        res.send("We could not log you in");
    }
};

exports.generateOTP = async (req, res) => {
    try {
        const { email } = req.body;


        const user = await Users.findOne({
            email,
            deleted: { $in: [false, null] }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        const hash = await bcrypt.hash(otp, 10);

        await Users.findOneAndUpdate({ email }, { otp: hash });

        const resend = new Resend(process.env.RESEND_KEY);

        const result = await resend.emails.send({
            from: "NomadHub <no-reply@nomad-hub.online>",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`,
        });

        setTimeout(async () => {
            await Users.findOneAndUpdate({ email }, { otp: null });
        }, 60000);

        return res.json({ message: "OTP sent to email successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const singleUser = await Users.findOne(
            { email, deleted: { $in: [false, null] } },
            { __v: 0, deleted: 0 }
        );
        if (!singleUser || !singleUser.otp) {
            return res.status(404).send("Invalid OTP");
        }
        let isEqual = await bcrypt.compare(otp, singleUser.otp);
        if (isEqual) {
            const jti = uuidv4();
            const token = jwt.sign({ id: singleUser._id, jti }, process.env.SIGNING_KEY_OTP, { expiresIn: "1h" });
            await OtpToken.create({ jti, userId: singleUser._id, expiresAt: new Date(Date.now() + 3600 * 1000) });
            res.json({
                message: "OTP verified successfully",
                token,
            });
            await Users.findOneAndUpdate({ email }, { otp: null });
        } else {
            return res.status(401).send("User not found");
        }
    } catch (err) {
        res.send("We could not verify your OTP");
    }
}

exports.resetPassword = async (req, res) => {
    try {
        let { email, new_password } = req.body;
        let singleUser = await Users.findOne(
            { email, deleted: { $in: [false, null] } },
            { __v: 0, deleted: 0 }
        );
        if (!singleUser) {
            return res.status(404).send("User not found");
        }
        if (!schema.validate(new_password)) {
            return res.status(400).json({
                message: "Password does not meet complexity requirements",
            });
        }
        let hash = await bcrypt.hash(new_password, saltRounds);
        await Users.findOneAndUpdate({ email }, { password: hash });
        res.json({ message: "Password reset successfully" });
    } catch (err) {
        res.send("We could not reset your password");
    }
}