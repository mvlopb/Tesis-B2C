import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { administratorSchema } from '@avila-tek/models';
import { Employee } from '../employee/employee.model';



export const Administrator = model('Administrator', administratorSchema)
export const AdministratorTC = composeMongoose(Administrator as any);


