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

export const orderMutations = Object.freeze({
  createManyOrders: OrderTC.mongooseResolvers.createMany(),
  createOneOrder: OrderTC.mongooseResolvers.createOne(),
  updateOneOrder: OrderTC.mongooseResolvers.updateOne(),
  updateOrderById: OrderTC.mongooseResolvers.updateById(),
  deleteOneOrder: OrderTC.mongooseResolvers.removeOne(),

//TODO - Update productos en orden  
  
//TODO - revisar para que se haga match con los estados

  // discountProductFromOrder: {
  //   type: OrderTC.getType(), 
  //   args: {
  //     orderId: 'MongoID!', 
  //     productId: 'MongoID!', 
  //     quantity: 'Int!', 
  //   },
  //   resolve: async (_: any, { orderId, productId, quantity }: { orderId: string; productId: string; quantity: number }) => {
  //     try {
  //       const order = await Order.findById(orderId);
  //       if (!order) {
  //         throw new Error('Orden no encontrada');
  //       }

  
  //       const productIndex = order.productsArray.findIndex(item => item.product && item.product.toString() === productId);
  //       if (productIndex === -1) {
  //         throw new Error('Producto no encontrado en la orden');
          
  //       }
        
  //       const client = await Client.findById(order.client)
  //       // @ts-ignore

  //       const storehouse = await Storehouse.findOne({state: client.state });

  //       if (!storehouse) {
  //         return next(new Error('No se encontró un almacén en el mismo estado que el cliente.'));

  //       }




  //       // const stockEntry = await Stock.findOne({ product: productId });
  //       // if (!stockEntry) {
  //       //   throw new Error('Stock no encontrado para el producto');
  //       // }
  
  //       // if (quantity > stockEntry.quantity) {
  //       //   throw new Error('No se puede descontar más de la cantidad disponible');
  //       // }
  
  //       // stockEntry.quantity += quantity; 
  //       // await stockEntry.save(); 
  
  //       // const productToUpdate = order.productsArray[productIndex];
  //       // if (!productToUpdate) {
  //       //   throw new Error('Producto no encontrado en la orden');
  //       // }
  //       // productToUpdate.quantity -= quantity;
  
  //       // if (productToUpdate.quantity <= 0) {
  //       //   order.productsArray.splice(productIndex, 1);
  //       // }
  
  //       // const updatedOrder = await order.save();
  //       // return updatedOrder;
        
  //     } catch (error) {
  //       if (error instanceof Error) {
  //         throw new Error(error.message);
  //       } else {
  //         throw new Error('Un error desconocido ha ocurrido');
  //       }
  //     }
  //   },
  // },
  
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
