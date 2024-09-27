import { Payment } from './payment.model';

async function findOne(args: any) {
  return Payment.findOne({ ...args });
}

async function findAll(args: any) {
  return Payment.find({ ...args });
}

export const paymentService = Object.freeze({
  findOne,
  findAll,
});
