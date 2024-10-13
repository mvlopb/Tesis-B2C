import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { paymentSchema } from '@avila-tek/models';


export const Payment = model('Payment', paymentSchema);
export const PaymentTC = composeMongoose(Payment as any);
