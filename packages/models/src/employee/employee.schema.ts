import { date, type z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const employeeSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      // required: [true, ''],
    },
    contractDate: {
      type: Date,
      default: Date.now,
    },
    department: {
      type: String,
      // required: true,
      enum: ['Admin', 'Manager', 'Support'],
    },
  }, 

  { discriminatorKey: 'department' }  

);
