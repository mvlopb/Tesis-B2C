import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { supportTicketSchema } from '@avila-tek/models';

export const SupportTicket = model('SupportTicket', supportTicketSchema);
export const SupportTicketTC = composeMongoose(SupportTicket as any);
