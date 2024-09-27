import { Manager } from '@/components/manager/manager.model';

async function findOne(args: any) {
  return Manager.findOne({ ...args });
}

async function findAll(args: any) {
  return Manager.find({ ...args });
}

export const managerService = Object.freeze({
  findOne,
  findAll,
});
