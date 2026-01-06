const express = require("express");
const userRoutes = require("./routes/user-routes");

const appRouter = express.Router();

appRouter.use("/users", userRoutes);

module.exports = appRouter;