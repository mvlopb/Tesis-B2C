import { Administrator } from '@/components/administrator/administrator.model';

async function findOne(args: any) {
  return Administrator.findOne({ ...args });
}

async function findAll(args: any) {
  return Administrator.find({ ...args });
}

export const administratorService = Object.freeze({
  findOne,
  findAll,
});
