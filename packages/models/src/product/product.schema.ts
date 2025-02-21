import { number, type z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, ''],
      trim: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Por favor introduzca la categoría a la cual pertenece el producto']
      },
    longDescription: {
      type: String,
      trim: true
    },    
    color: {
      type: String,
    },
    tag: {
    type: String,
    enum: ['Mujer', 'Hombres', 'Entrenamiento', 'Ninos', 'Futbol', 'Originales', 'Esenciales', 'Natacion', 'Trotar'],
    },
    images: [{
      type: String,
     }
    ],
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
    },
     soldQty: {
      type: Number,
       default: 0.00,
     },
     editedBy: [
      {
        manager: {
          type: Schema.Types.ObjectId,
          ref: 'Employee'
        },

        lastUpdate: {
          type: Date,
          required: true,
        }
      }
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      // required: true,
      },

  },
);


productSchema.index({ name: 1 });

productSchema.index({ category: 1 });

productSchema.index({ price: 1 });

productSchema.index({ tag: 1 });

productSchema.index({ sku: 1 });



