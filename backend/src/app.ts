import express from "express";
import passport from "passport";
import session from "express-session";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import "./config/passport";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    secret: "devtracker_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

app.use(errorHandler);

export default app;
