import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { orderSchema } from '@avila-tek/models';


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
