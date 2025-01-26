import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const supportTicketSchema = new Schema(
  {
    supportId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: [true, 'Es necesaria el id del support para asignarle su ticket']
    },


    clientId: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Es necesaria el id del cliente para asignarle su ticket']

    },

    
    description: {
      type: String,
      required: true,
    },

    ticketDate: {
      type: Date,
      required: true
    },

    ticketState: {
      type: String,
      enum: ["sent", "resolved"]
    }


  },
);

