const Users = require("../models/users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");

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
        let saltRounds = 10;
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
            data: newUser
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
