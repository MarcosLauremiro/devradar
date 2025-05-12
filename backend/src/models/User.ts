import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  githubId: string;
  username: string;
  name?: string;
  avatarUrl?: string;
  bio?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  technologies: string[];
  experienceLevel: "Junior" | "Pleno" | "Senior";
  availability: "Freelancer" | "Full-time" | "Part-time" | "Unavailable";
  website?: string;
  linkedin?: string;
  createdAt: Date;
  updatedAt: Date;
  email?: string;
  password?: string;
  isGithubLinked?: boolean;
}

const userSchema = new Schema<IUser>(
  {
    githubId: { type: String },
    isGithubLinked: { type: Boolean, default: false },
    username: { type: String, required: true },
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    password: { type: String },
    avatarUrl: { type: String },
    bio: { type: String },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    technologies: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["Junior", "Pleno", "Senior"],
    },
    availability: {
      type: String,
      enum: ["Freelancer", "Full-time", "Part-time", "Unavailable"],
    },
    website: { type: String },
    linkedin: { type: String },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
