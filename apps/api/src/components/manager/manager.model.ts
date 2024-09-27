import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { managerSchema } from '@avila-tek/models';
import { Employee } from '../employee/employee.model';



export const Manager = model('Manager', managerSchema)
export const ManagerTC = composeMongoose(Manager as any);


