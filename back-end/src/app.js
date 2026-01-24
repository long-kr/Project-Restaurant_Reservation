const express = require("express");
const rateLimit = require("express-rate-limit");

const cors = require("cors");
const { httpLogger } = require("./config/logger");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const config = require("./config");
const limiter = rateLimit(config.rateLimit);

const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");
const healthsRouter = require("./healths/healths.router");

const app = express();

app.use(cors(config.cors));
app.options("*", cors(config.cors));

// Security and parsing middleware
app.use(cors(config.cors));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(limiter);
app.use(httpLogger);

app.use("/health", healthsRouter);
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;
