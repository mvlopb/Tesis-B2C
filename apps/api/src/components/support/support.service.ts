import { Support } from '@/components/support/support.model';

async function findOne(args: any) {
  return Support.findOne({ ...args });
}

async function findAll(args: any) {
  return Support.find({ ...args });
}

export const supportService = Object.freeze({
  findOne,
  findAll,
});
