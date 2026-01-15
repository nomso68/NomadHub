const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
    space_name: {
        type: String,
        required: true
    },
    City: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Locations"
    },
    street_address: [{
        type: String,
        required: true,
    }],
    pricing: {
        type: String,
        required: true,
    },
    download_speed_entries: [{
        type: String,
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

module.exports = mongoose.model("Spaces", SpaceSchema);