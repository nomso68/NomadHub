const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        let url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7jagi.mongodb.net/?appName=Cluster0`;
        await mongoose.connect(url);
        console.log("Connected to DB successfully");
    } catch (error) {
        console.error("Error connectng to MongoDB:", error.message);
    }
};

module.exports = connectToDB;