import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const stockSchema = new Schema(
  {
    restockDate: {
      type: Date,
      required: [true, 'Por favor introduzca una fecha'],
      
    },
    storehouse: {
        type: Schema.Types.ObjectId,
        ref: 'Storehouse',
        required: [true, 'Introduzca el id de un almacén'],
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Introduzca el id de un producto'],
    },    
    quantity: {
      type: Number,
      required: [true, "Por favor introduzca un número válido"],
      validate: {
        validator: (value: number) => {
          return value >= 0;
        },
        message: 'El campo "cantidad" debe ser un número positivo.'
      }
    }
  },
);

stockSchema.index({ quantity: 1 });
stockSchema.index({ restockDate: -1 });

