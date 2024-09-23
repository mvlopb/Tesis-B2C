import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const clientSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, ''],
    },
    orders: [
      { type: Schema.Types.ObjectId, 
        ref: 'Order' }
    ],
  }, 
  


);
