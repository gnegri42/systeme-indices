const express = require("express");
const espRoutes = require("./routes/espRoutes");
const chronometerRoutes = require("./routes/chronometerRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/setEtat", espRoutes);
app.use("/chronometer", chronometerRoutes);

module.exports = app;
