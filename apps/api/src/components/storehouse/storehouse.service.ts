import { Storehouse } from './storehouse.model';

async function findOne(args: any) {
  return Storehouse.findOne({ ...args });
}

async function findAll(args: any) {
  return Storehouse.find({ ...args });
}

export const storehouseService = Object.freeze({
  findOne,
  findAll,
});
