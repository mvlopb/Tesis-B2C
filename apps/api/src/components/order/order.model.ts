import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { orderSchema } from '@avila-tek/models';

export const Order = model('Order', orderSchema);
export const OrderTC = composeMongoose(Order as any);
