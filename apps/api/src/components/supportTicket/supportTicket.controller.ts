import type { FastifyRequest, FastifyReply } from 'fastify';
import { supportTicketService } from './supportTicket.service';
import { SupportTicketTC } from './supportTicket.model';

export const supportTicketQueries = Object.freeze({
  supportTicket: SupportTicketTC.mongooseResolvers.findOne(),
  supportTickets: SupportTicketTC.mongooseResolvers.findMany(),
});

export const supportTicketMutations = Object.freeze({
  createManySupportTickets: SupportTicketTC.mongooseResolvers.createMany(),
  createOneSupportTicket: SupportTicketTC.mongooseResolvers.createOne(),
  updateOneSupportTicket: SupportTicketTC.mongooseResolvers.updateOne(),
});
