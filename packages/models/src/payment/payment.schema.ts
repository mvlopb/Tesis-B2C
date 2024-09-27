import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const paymentSchema = new Schema(
  {
    order: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, ''],
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'cancelled'],
      default: 'pending',
    },
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ['credit card', 'paypal', 'transference', 'pago móvil']
    },
    ref: {
      type: Number,
      default: null,
    },

  },
  { timestamps: true }
);
