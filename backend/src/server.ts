import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import { setupSwagger } from "./config/swagger";
import session from "express-session";
import passport from "passport";
import authRoutes from "./routes/authRoutes";
import "./config/passport";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
setupSwagger(app);
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection error", err);
  });

app.use("/api", userRoutes);

app.use(
  session({
    secret: "devtracker_secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
