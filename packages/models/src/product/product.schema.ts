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
    shortDescription: {
      type: String,
      trim: true
    },
    longDescription: {
      type: String,
      trim: true
    },    
    images: [{
      type: String,
      validate: {
        validator: function (v: string) {

          return /^(https?:\/\/)([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(v);
        },
        message: (props: any) => `${props.value} no es un url válido`,
      },
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
    // soldQty: {
    //   type: number,
    //   default: 0,
    // }
  },
);
