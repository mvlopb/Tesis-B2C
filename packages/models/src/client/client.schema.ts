import type { z } from 'zod';
import { Schema, type Types, type Document } from 'mongoose';

export const clientSchema = new Schema(
  {
    orders: [
      { type: Schema.Types.ObjectId, 
        ref: 'Order' }
    ],
    supportTickets: [
      {
        type: Schema.Types.ObjectId,
        ref: 'SupportTicket'
      }
    ]
  }, 

);
