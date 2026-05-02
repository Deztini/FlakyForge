"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
const ApiError_1 = require("../utils/ApiError");
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const token = (_a = req.cookies) === null || _a === void 0 ? void 0 : _a.accessToken;
            if (!token) {
                throw ApiError_1.ApiError.unauthorized("No token provided");
            }
            const payload = (0, jwt_1.verifyAccessToken)(token);
            const user = yield User_1.User.findById(payload.userId).select("-password");
            if (!user) {
                throw ApiError_1.ApiError.unauthorized("User not found");
            }
            req.user = user;
            next();
        }
        catch (error) {
            next(error instanceof ApiError_1.ApiError
                ? error
                : ApiError_1.ApiError.unauthorized("Invalid or expired token"));
        }
    });
}
