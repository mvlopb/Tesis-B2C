import type { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from './order.service';
import { OrderTC } from './order.model';

export const orderQueries = Object.freeze({
  order: OrderTC.mongooseResolvers.findOne(),
  orders: OrderTC.mongooseResolvers.findMany(),
});

export const orderMutations = Object.freeze({
  createManyOrders: OrderTC.mongooseResolvers.createMany(),
  createOneOrder: OrderTC.mongooseResolvers.createOne(),
  updateOneOrder: OrderTC.mongooseResolvers.updateOne(),
});
