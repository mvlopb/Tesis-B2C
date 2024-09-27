import { date, type z } from 'zod';
import { Schema, type Types, type Document, SchemaType } from 'mongoose';

export const employeeSchema = new Schema(
  {
    contractDate: {
      type: Date,
      default: Date.now,
    },

    department: {
      type: String,
      enum: ['Administrator', 'Manager', 'Support']
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },   

);
