import { SupportTicket } from './supportTicket.model';

async function findOne(args: any) {
  return SupportTicket.findOne({ ...args });
}

async function findAll(args: any) {
  return SupportTicket.find({ ...args });
}

export const supportTicketService = Object.freeze({
  findOne,
  findAll,
});
