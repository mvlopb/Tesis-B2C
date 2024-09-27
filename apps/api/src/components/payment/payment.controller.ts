import type { FastifyRequest, FastifyReply } from 'fastify';
import { paymentService } from './payment.service';
import { PaymentTC } from './payment.model';

export const paymentQueries = Object.freeze({
  payment: PaymentTC.mongooseResolvers.findOne(),
  payments: PaymentTC.mongooseResolvers.findMany(),
});

export const paymentMutations = Object.freeze({
  createManyPayments: PaymentTC.mongooseResolvers.createMany(),
  createOnePayment: PaymentTC.mongooseResolvers.createOne(),
  updateOnePayment: PaymentTC.mongooseResolvers.updateOne(),
});
