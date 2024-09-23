import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { productSchema } from '@avila-tek/models';

export const Product = model('Product', productSchema);
export const ProductTC = composeMongoose(Product as any);
