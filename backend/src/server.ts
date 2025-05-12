import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app";
import { setupSwagger } from "./config/swagger";

dotenv.config();

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI || "")
  .then(() => {
    console.log("MongoDB connected");
    setupSwagger(app);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection error", err);
  });
