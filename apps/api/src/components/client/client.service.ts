import { Client } from '@/components/client/client.model';

async function findOne(args: any) {
  return Client.findOne({ ...args });
}

async function findAll(args: any) {
  return Client.find({ ...args });
}

export const clientService = Object.freeze({
  findOne,
  findAll,
});
