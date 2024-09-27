import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { supportSchema } from '@avila-tek/models';
import { Employee } from '../employee/employee.model';



export const Support = model('Support', supportSchema)
export const SupportTC = composeMongoose(Support as any);


