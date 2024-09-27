import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, ''],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    }
    //imagen
  },
);
