import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { storehouseSchema } from '@avila-tek/models';

export const Storehouse = model('Storehouse', storehouseSchema);
export const StorehouseTC = composeMongoose(Storehouse as any);
