import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';


interface ILocation {
  type: 'Point';
  coordinates: [number, number];
}

interface IAddress {
  state: string;
  city: string;
  direction?: string;
  location: ILocation;
}

interface IStorehouse extends Document {
  name: string;
  address: IAddress;
  createdBy: Types.ObjectId;
}

export const storehouseSchema = new Schema<IStorehouse>(
  {
    name: {
      type: String,
      required: [true, 'Por favor introduzca un nombre'],
      trim: true,
    },
    address: {
      state: {
        type: String,
        required: [true, 'Es necesario agregar el estado de residencia del almacén'],
      },
      city: {
        type: String,
        required: [true, 'Es necesario agregar la ciudad de residencia del almacén'],
      },
      direction: {
        type: String,
      },
      location: {
        type: {
          type: String,
          enum: ['Point'],
          required: true,
        },
        coordinates: {
          type: [Number],
          required: true,
          validate: {
            validator: (coords: number[]) => coords.length === 2,
            message: 'Las coordenadas deben contener exactamente dos valores: [longitud, latitud]',
          },
        },
      },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
  },
  { timestamps: true }
);

storehouseSchema.index({ 'address.location': '2dsphere' });
