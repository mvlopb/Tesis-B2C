import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { stockSchema } from '@avila-tek/models';



// stockSchema.pre('save', async function (next) {

//     const stock = this;

//     if (!stock.isModified('quantity')) {
//         return next();
//     }

//     if (stock.quantity <= 10) {
//         //enviar alerta
//     }

// });

// no se repita el nombre de la dirección en la misma ciudad

export const Stock = model('Stock', stockSchema);
export const StockTC = composeMongoose(Stock as any);
