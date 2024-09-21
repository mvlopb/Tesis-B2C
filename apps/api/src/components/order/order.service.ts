import { Order } from './order.model';

async function findOne(args: any) {
  return Order.findOne({ ...args });
}

async function findAll(args: any) {
  return Order.find({ ...args });
}

export const orderService = Object.freeze({
  findOne,
  findAll,
});
