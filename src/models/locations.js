const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
    location_name: {
        type: String,
        required: true
    },
    average_upload_speed: {
        type: Number,
        required: true,
        min: 0
    },
    upload_speed_entries: [{
        type: Number,
        required: true, min: 0
    }],
    average_download_speed: {
        type: Number,
        required: true,
        min: 0
    },
    average_download_speed: {
        type: Number,
        required: true,
        min: 0
    },
    download_speed_entries: [{
        type: Number,
        required: true, min: 0
    }],
    connection_stability: {
        type: String,
        enum: ["Poor", "Fair", "Good", "Excellent"],
        required: true
    },
    connection_stability_entries: [{
        type: Number,
        enum: [1, 2, 3, 4],
        required: true
    }],
    deleted: { type: Boolean, default: false, select: false },
},
    { timestamps: true }
);

module.exports = mongoose.model("Locations", LocationSchema);