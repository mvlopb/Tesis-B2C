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

  // Mutación personalizada para actualizar el status de una orden
  updateOrderStatus: {
    type: OrderTC.getType(), // El tipo de retorno es el modelo de la orden
      args: {
        orderId: 'MongoID!', // Argumento obligatorio, ID de la orden
        status: 'String!',   // El nuevo status que será actualizado
      },
    },

    
});
