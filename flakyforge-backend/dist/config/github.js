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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_github2_1 = require("passport-github2");
const User_1 = require("../models/User");
const env_1 = require("./env");
const axios_1 = __importDefault(require("axios"));
passport_1.default.use(new passport_github2_1.Strategy({
    clientID: env_1.env.GITHUB_CLIENT_ID,
    clientSecret: env_1.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${env_1.env.BACKEND_URL}/api/auth/github/callback`,
    proxy: true,
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        if (!email) {
            const response = yield axios_1.default.get("https://api.github.com/user/emails", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const primaryEmail = response.data.find((e) => e.primary && e.verified);
            email = primaryEmail === null || primaryEmail === void 0 ? void 0 : primaryEmail.email;
        }
        if (!email) {
            return done(new Error("GitHub email not available"), undefined);
        }
        let user = yield User_1.User.findOne({ email });
        if (!user) {
            user = yield User_1.User.create({
                email,
                fullName: profile.displayName || profile.username,
                password: "",
                isVerified: true,
                provider: "github",
                githubAccessToken: accessToken,
            });
        }
        else {
            user.githubAccessToken = accessToken;
            yield user.save();
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, undefined);
    }
})));
