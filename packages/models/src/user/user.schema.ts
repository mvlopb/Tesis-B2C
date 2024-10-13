import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Es necesario agregar el nombre del usuario'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Es necesario agregar el apellido del usuario'],
      trim: true,
    },
    email: {
      unique: true,
      type: String,
      required: [true, 'Es necesario agregar el correo electrónico del usuario'],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      unique: true,
    },

    birthday: {
      type: String,
    },
    
    password: {
      type: String,
      required: [true, 'Es necesario agregar una contraseña del usuario'],
    },
    state: {
      type: String,
      required: [true, 'Es necesario agregar el estado de residencia del usuario']
    },
    city: {
      type: String,
      required: [true, 'Es necesario agregar la ciudad de residencia del usuario']
    },
    address: [
      {direction: {
        type: String,
      }

      }
    ],
    gender: {
      type: String,
      enum: ['m','f','na']
    },
    role: {
      type: String,
      enum: ['Client', 'Employee'],
      required: [true, 'Es necesario definir el tipo de usuario'],
    }
  },
  { timestamps: true, discriminatorKey: 'role' }
);
