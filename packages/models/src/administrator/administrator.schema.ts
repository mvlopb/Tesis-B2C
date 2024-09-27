import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const administratorSchema = new Schema(
  {
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Es necesaria el id del empleado para asignarlo a la colección de administradores']
    }
  },
);
