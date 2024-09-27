import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const storehouseSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Por favor introduzca un nombre'],
      trim: true,
      
    },
    state: {
      type: String,
      trim: true,
      required: [true, "Por favor introduzca un estado"],
    },
    city: {
      type: String,
      trim: true,
      required: [true, "Por favor introduzca una ciudad"],
    },    
    address: {
      type: String,
      trim: true,
      required: [true, "Por favor introduzca una dirección válida"],
    }
  },
);
