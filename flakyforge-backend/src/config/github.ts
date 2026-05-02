import passport from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import { User } from "../models/User";
import { env } from "./env";
import { RefreshToken } from "../models/RefreshToken";
import axios from "axios";
import { Profile } from "passport-github2";

passport.use(
  new GithubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: `${env.BACKEND_URL}/api/auth/github/callback`,
      proxy: true,
    },
    async (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any) => void) => {
      try {
        let email = profile.emails?.[0]?.value;

        if (!email) {
          const response = await axios.get(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const primaryEmail = response.data.find(
            (e: any) => e.primary && e.verified,
          );

          email = primaryEmail?.email;
        }

        if (!email) {
          return done(new Error("GitHub email not available"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            fullName: profile.displayName || profile.username,
            password: "",
            isVerified: true,
            provider: "github",
            githubAccessToken: accessToken,
          });
        } else {
          user.githubAccessToken = accessToken;

          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    },
  ),
);
