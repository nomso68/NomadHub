const mongoose = require("mongoose");

const otpTokenSchema = new mongoose.Schema({
    jti: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    used: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true }
});

otpTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpToken", otpTokenSchema);
