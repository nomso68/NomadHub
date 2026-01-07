const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    work_type: {
        type: String,
        enum: ["Software Developer", "Designer", "Data Analyst", "Marketing", "Sales", "Consultants"],
        required: true
    },
    preferred_environment: {
        type: String,
        enum: ["Co-Working Spaces", "Cafes & Coffee Shops", "Home/Apartments", "Libraries", "Hotels", "Outdoor Spaces"],
        required: true
    },
    time_zone: {
        type: String,
        enum: ["West African Time", "Americas EST/PST", "East Asia & Pacific"],
        required: true
    },
    budget_range: {
        type: String,
        enum: ["Budget Friendly", "Moderate", "Comfortable", "Luxury"],
        required: true
    },
    interests_and_hobbies: [{
        type: String,
        enum: ["Budget Friendly", "Fitness & Wellness", "Hiking & Nature", "Beach & Watersports", "Music & Nightlife", "Photography", "History & Museums", "Networking"]
    },
    ],
    languages: [{
        type: String,
        enum: ["English", "Spanish", "Portuguese", "Mandarin", "Hotels", "Outdoor Spaces"],
        required: true
    }],
    deleted: { type: Boolean, default: false, select: false },
    password: { type: String, required: true },
    otp: { type: String || null }
},
    { timestamps: true }
);

module.exports = mongoose.model("Users", UserSchema);