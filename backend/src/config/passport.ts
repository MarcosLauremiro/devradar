import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Request } from "express";
import { User } from "../models/user";
import dotenv from "dotenv";

dotenv.config();

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_CALLBACK_URL || "",
      passReqToCallback: true,
    },
    async (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: (error: any, user?: any) => void
    ) => {
      try {
        if (req.user) {
          const user = await User.findById((req.user as any)._id);
          if (user) {
            user.githubId = profile.id;
            user.avatarUrl = profile.photos?.[0]?.value;
            user.bio = profile._json?.bio;
            await user.save();
            return done(null, user);
          }
        } else {
          const existingUser = await User.findOne({ githubId: profile.id });
          if (existingUser) {
            return done(null, existingUser);
          }

          const newUser = await User.create({
            githubId: profile.id,
            username: profile.username,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            bio: profile._json?.bio,
            technologies: [],
          });

          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
