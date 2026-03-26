import passport from "passport";
import {Strategy as GithubStrategy} from "passport-github2";
import { User } from "../models/User";
import { env } from "./env";
import { RefreshToken } from "../models/RefreshToken";

passport.use(new GithubStrategy({clientID: env.GITHUB_CLIENT_ID, clientSecret: env.GITHUB_CLIENT_SECRET, callbackURL: "/api/auth/github/callback"}, async (accessToken, RefreshToken, profile, done) => {
  try {
   const email = profile.emails?.[0]?.value;
   
   let user = await User.findOne({email});

   if (!user) {
    user = await User.create({
      email,
      fullName: profile.displayName || profile.username,
      password: "",
      isVerified: true
    });
   }

   return done(null, user);
  } catch (err) {
    return done(err, undefined);
  }
}))