import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { stockSchema } from '@avila-tek/models';



// no se repita el nombre de la dirección en la misma ciudad

export const Stock = model('Stock', stockSchema);
export const StockTC = composeMongoose(Stock as any);
