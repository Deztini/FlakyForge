"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const passport_1 = __importDefault(require("passport"));
require("./config/github");
const index_1 = __importDefault(require("./routes/index"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimiter_1 = require("./middleware/rateLimiter");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: env_1.env.VERCEL_URL,
    credentials: true,
}));
app.use(express_1.default.json());
app.use(rateLimiter_1.globalLimiter);
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use("/api", index_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
