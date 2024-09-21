import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      required: [true, ''],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, ''],
    },
  },
  { timestamps: true }
);
