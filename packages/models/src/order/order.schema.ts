import { number, type z } from 'zod';
import mongoose, { Schema, type Types, type Document } from 'mongoose';
export const orderSchema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, ''],
    },
    status: {
      type: String,
      enum: ['placed', 'confirmed', 'processing', 'shipped', 'cancelled'],
      default: 'placed',
      required: true,
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
        message: 'El campo "cantidad" debe ser un número positivo.'
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

    deliveryDetails: {
      delivery: {
        type: Schema.Types.ObjectId,
        ref: 'Employee',
        //validacion de que solo se inserte el tipo de empleado delivery
      },
      selectedAddress: {
        type: Schema.Types.ObjectId,
        ref: 'User.address',
        required: true,
      },
      status: {
        type: String,
        enum: ['ready for dispatch', 'out for delivery', 'on the way', 'shipped'],
        default: 'ready for dispatch',        
      },
      distance: {
        type: Number,
        validate: {
          validator: (value: number) => {
            return value >= 0;
          },
          message: 'El campo "subtotal" debe ser un número positivo.'
        },
        //buscar como hacer referencia a un atributo en otro documento
      }
    },

  },
  { timestamps: true }
);

orderSchema.index({ client: 1 });
orderSchema.index({ orderDate: -1 });
orderSchema.index({ client: 1, orderDate: -1 });