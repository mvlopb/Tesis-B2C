import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { employeeSchema } from '@avila-tek/models';
import { User } from '../users/user.model';



export const Employee = User.discriminator('Employee', employeeSchema)
export const EmployeeTC = composeMongoose(Employee as any);


