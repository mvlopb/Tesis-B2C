import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true
    },
    longDescription: {
      type: String,
      trim: true
    },    
    price: {
      type:Number,
      required: [true, ''],
      default:0.00,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: 'El campo "precio" debe ser un número positivo.'
      }
    },
    sku: {
      type: String,
      trim: true,
      required: [true, ""],
      unique: true
    }
  },
);
