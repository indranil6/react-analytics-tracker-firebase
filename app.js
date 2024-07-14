const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const analyticsRoutes = require("./routes/analyticsRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(bodyParser.json());
app.use(cors()); // Enable CORS

app.use(analyticsRoutes);
app.use(authRoutes);

module.exports = app;
