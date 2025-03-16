import type { FastifyRequest, FastifyReply } from 'fastify';
import { orderService } from './order.service';
import { Order, OrderTC } from './order.model';
import { schemaComposer } from 'graphql-compose';
import { Stock } from '../stock/stock.model';
import { Storehouse } from '../storehouse/storehouse.model';
import { Client } from '../client/client.model';


export const orderQueries = Object.freeze({
  order: OrderTC.mongooseResolvers.findOne(),
  orders: OrderTC.mongooseResolvers.findMany(),
  orderByClient: OrderTC.mongooseResolvers.findByIds(),
});

schemaComposer.createEnumTC({
  name: 'OrderStatusEnum',
  values: {
    PLACED: { value: 'placed' },
    CONFIRMED: { value: 'confirmed' },
    PROCESSING: { value: 'processing' },
    SHIPPED: { value: 'shipped' },
  },
});

OrderTC.getInputTypeComposer().extendField('_id', { type: 'MongoID' });

export const orderMutations = Object.freeze({
  createManyOrders: OrderTC.mongooseResolvers.createMany(),
  createOneOrder: OrderTC.mongooseResolvers.createOne(),
  updateOneOrder: OrderTC.mongooseResolvers.updateOne(),
  updateOrderById: OrderTC.mongooseResolvers.updateById(),
  deleteOneOrder: OrderTC.mongooseResolvers.removeOne(),
  updateProductQuantityInOrder: {
    type: OrderTC.getType(),
    args: {
      orderId: 'MongoID!',
      productId: 'MongoID!',
      quantity: 'Int!',
    },
    resolve: async (_: any, { orderId, productId, quantity }: { orderId: string; productId: string; quantity: number }) => {
      try {
        const order = await Order.findOne({ _id: orderId }).populate('productsArray.product');
    
        if (!order) {
          throw new Error('Orden no encontrada');
        }
    
        const productIndex = order.productsArray.findIndex(p => 
          p.product && p.product._id.toString() === productId
        );
    
        if (productIndex === -1) {
          throw new Error('Producto no encontrado en la orden');
        }
        //@ts-ignore
        order.productsArray[productIndex].quantity = quantity;
    
        await order.save();
    
        return order;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('Un error desconocido ha ocurrido');
        }
      }
    },
  },
    updateOrderStatus: {
    type: OrderTC.getType(),
    args: {
      orderId: 'MongoID!',
      status: 'OrderStatusEnum!',
    },
    resolve: async (_: any, { orderId, status }: { orderId: string; status: string }) => {
      try {
        const updatedOrder = await Order.findOneAndUpdate(
          { _id: orderId },
          { $set: { status } },
          { new: true }
        );
  
        if (!updatedOrder) {
          throw new Error('Orden no encontrada');
        }
  
        return updatedOrder;
      } catch (error) {
        if (error instanceof Error) {
          throw new Error(error.message);
        } else {
          throw new Error('Un error desconocido ha ocurrido');
        }
      }
    },
  },
  
    
});
