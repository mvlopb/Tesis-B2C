import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { categorySchema } from '@avila-tek/models';

export const Category = model('Category', categorySchema);
export const CategoryTC = composeMongoose(Category as any);
