const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        let url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.7jagi.mongodb.net/?appName=Cluster0`;
        await mongoose.connect(url);
    } catch (error) {
    }
};

module.exports = connectToDB;