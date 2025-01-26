import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { orderSchema } from '@avila-tek/models';
import { Stock } from '../stock/stock.model';
import { Client } from '../client/client.model';
import { Storehouse } from '../storehouse/storehouse.model';
import { Product } from '../product/product.model';


//ANCHOR - pre save para descontar del stock de producto

orderSchema.pre('save', async function (next) {
  const order = this;

  if (!order.isNew && !order.isModified('productsArray')) {
    return next();
  }

  try {
    const client = await Client.findById(order.client);
    if (!client) {
      return next(new Error('Cliente no encontrado'));
    }

    //TODO - Cambiar código
    // @ts-ignore    
    const storehouse = await Storehouse.findOne({ state: client.state });
    if (!storehouse) {
      return next(new Error('No se encontró un almacén en el mismo estado que el cliente.'));
    }


    
    let originalOrder;
    if (!order.isNew) {
      originalOrder = await Order.findById(order._id);
    }

    for (const item of order.productsArray) {
      const stockEntry = await Stock.findOne({
        product: item.product,
        storehouse: storehouse._id,
      }).populate('product', 'name').populate('storehouse', 'name');
      

      if (!stockEntry) {
        return next(new Error(`No se encontró stock para el producto ${item.product} en el almacén ${storehouse.name}`));
      }

      const product = await Product.findById(item.product); // Obtener el producto
      if (!product) {
        return next(new Error('Producto no encontrado.'));
      }

      let preQuantity = 0;

      if (originalOrder) {
        const preItem = originalOrder.productsArray.find((p) => p.product && p.product.equals(item.product));
        if (preItem) {
          preQuantity = preItem.quantity;
        }
      }

      const quantityDiff = item.quantity - preQuantity;

      if (quantityDiff > 0) { 
        if (stockEntry.quantity >= quantityDiff) {
          stockEntry.quantity -= quantityDiff; 
          product.soldQty += quantityDiff; 
          await stockEntry.save();
          await product.save();
        } else {
// @ts-ignore
          return next(new Error(`Stock insuficiente para el producto ${stockEntry.product.name} en el almacén ${stockEntry.storehouse.name}.`));
        }
      } else if (quantityDiff < 0) { 
        stockEntry.quantity += Math.abs(quantityDiff); 
        product.soldQty -= Math.abs(quantityDiff); 
        await stockEntry.save();
        await product.save();
      }
    }

    next();
  } catch (error) {
    if (error instanceof Error) {
      next(new Error(error.message));
    } else {
      next(new Error('Un error desconocido ha ocurrido'));
    }
  }
});

//ANCHOR - pre save para calcular el sub total y el total de la orden

orderSchema.pre('save', async function (next) {

    const order = this;

    if (!order.isModified('productsArray')) {
      return next();
    }
  
    let subTotal = 0.00;
  
    for (const item of order.productsArray) {
      const product = await model('Product').findById(item.product); 
      if (product) 
        {subTotal += product.price * item.quantity; } }

      order.subTotal = subTotal

      order.total = order.subTotal * 1.16,

      next();
  });



export const Order = model('Order', orderSchema);
export const OrderTC = composeMongoose(Order as any);
