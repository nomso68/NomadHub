const express = require('express');
const connectToDB = require("./src/config/db");
const dotenv = require("dotenv");
const appRouter = require("./src/app")
const cors = require("cors");

dotenv.config()
const app = express();
connectToDB();
app.use(express.json());
app.use(cors());
app.use("/api/v1", appRouter)
const port = process.env.PORT

app.listen(port, () => {
    console.log(`Connected to port ${port}`)
})