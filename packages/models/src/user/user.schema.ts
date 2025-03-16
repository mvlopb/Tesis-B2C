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
      validate: {
        validator: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: props => `${props.value} no es un correo electrónico válido`,
      },
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
    address: [
      {state: {
        type: String,
        required: [true, 'Es necesario agregar el estado de residencia del usuario']
      },
      city: {
        type: String,
        required: [true, 'Es necesario agregar la ciudad de residencia del usuario']
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
              message: 'Las coordenadas deben contener al menos dos valores: [longitud, latitud]',
            },
          },
        },
      },
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

userSchema.index({ 'address.location': '2dsphere' }); //TODO - generar resto de indexes

userSchema.path('address').validate(function(value: any[]) {
  return value.length <= 5; 
}, 'El usuario no puede tener más de 5 direcciones.');