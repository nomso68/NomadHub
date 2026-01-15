const express = require("express");
const userRoutes = require("./routes/user-routes");
const locationRoutes = require("./routes/location-routes");

const appRouter = express.Router();

appRouter.use("/users", userRoutes);
appRouter.use("/locations", locationRoutes);
module.exports = appRouter;