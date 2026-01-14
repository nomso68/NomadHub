const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const NodemailerHelper = require("nodemailer");
// const mongoose = require("mongoose");
const { Resend } = require("resend");

dotenv.config();
const saltRounds = 10;

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
            let token = jwt.sign({ id: singleUser._id }, process.env.SIGNING_KEY);
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


        // const transporter = NodemailerHelper.createTransport({
        //     service: "gmail",
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASS
        //     }
        // });
        const resend = new Resend(process.env.RESEND_KEY);
        (process.env.RESEND_KEY);

        const result = await resend.emails.send({
            from: "NomadHub <no-reply@nomad-hub.online>",
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP is ${otp}`,
        });

        return res.json({ message: "OTP sent to email successfully" });

    } catch (err) {
        console.error("OTP error:", err);
        return res.status(500).json({ message: "Failed to send OTP" });
    }
};

exports.verifyOTP = async (req, res) => {
    try {
        let { email, otp } = req.body;
        let singleUser = await Users.findOne(
            { email, deleted: { $in: [false, null] } },
            { __v: 0, deleted: 0 }
        );
        if (!singleUser) {
            return res.status(404).send("User not found");
        }
        let isEqual = await bcrypt.compare(otp, singleUser.otp);
        if (isEqual) {
            let token = jwt.sign({ id: singleUser._id }, process.env.SIGNING_KEY_OTP);
            res.json({
                message: "OTP verified successfully",
                token,
            });
        } else {
            return res.status(401).send("User not found");
        }
    } catch (err) {
        res.send("We could not log you in");
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
        let hash = await bcrypt.hash(new_password, saltRounds);
        await Users.findOneAndUpdate({ email }, { password: hash, otp: null });
        res.json({ message: "Password reset successfully" });
    } catch (err) {
        res.send("We could not reset your password");
    }
}