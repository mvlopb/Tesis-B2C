import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';
export const orderSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, ''],
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped'],
      default: 'placed',
    },
    orderDate: {
      type: Date,
    },
    productsArray: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',

    },
    quantity: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: 'El campo "subtotal" debe ser un número positivo.'
      }
    }
    }, ],

    subTotal: {
      type: Number,
      default: 0.00,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: 'El campo "subtotal" debe ser un número positivo.'
      }
    },

    total: {
      type: Number,
      default: 0.00,
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: 'El campo "total" debe ser un número positivo.'
      }
    },

    notification: [
      {
        type: String,
      }
    ]

  },
  { timestamps: true }
);
