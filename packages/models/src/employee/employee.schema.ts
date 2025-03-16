import { date, type z } from 'zod';
import { Schema, type Types, type Document, SchemaType } from 'mongoose';

export const employeeSchema = new Schema(
  {
    contractDate: {
      type: Date,
      default: Date.now,
      required: true,
    },

    department: {
      type: String,
      enum: ['Administrator', 'Delivery', 'Manager', 'Support']
    },

    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active', 
      required: true,
    }
  },   

);
