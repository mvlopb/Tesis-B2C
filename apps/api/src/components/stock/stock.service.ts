import { Stock } from './stock.model';

async function findOne(args: any) {
  return Stock.findOne({ ...args });
}

async function findAll(args: any) {
  return Stock.find({ ...args });
}

export const stockService = Object.freeze({
  findOne,
  findAll,
});
