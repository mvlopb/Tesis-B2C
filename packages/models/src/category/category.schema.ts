import type { z } from 'zod';
import { Schema, type Types, type Document, SchemaType } from 'mongoose';

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
    },
    editedBy: [
      {
        manager: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        },

        lastUpdate: {
          type: Date,
        }
      }
    ],
    createdBy:     {
          type: Schema.Types.ObjectId,
          ref: 'Employee',      
      }
    
  },
);
