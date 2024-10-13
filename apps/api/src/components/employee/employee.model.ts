import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { employeeSchema } from '@avila-tek/models';
import { User } from '../users/user.model';

employeeSchema.pre('save', async function (next) {
    const employee = this;
  
    try {

      if (employee.isNew || employee.isModified('department')) {

        if (employee.department === 'Administrator') {
          const Administrator = model('Administrator');
          await Administrator.create({ employeeId: employee._id });


        } else if (employee.department === 'Manager') {
          const Manager = model('Manager');


          await Manager.create({ employeeId: employee._id });
        } else if (employee.department === 'Support') {
          const Support = model('Support');


          await Support.create({ employeeId: employee._id });
        }
      }
      next();
    } catch (error) {
    if (error instanceof Error) {
      next(new Error(error.message));
    } else {
      next(new Error('Un error desconocido ha ocurrido'));
    }
  }
  });
  

export const Employee = User.discriminator('Employee', employeeSchema)
export const EmployeeTC = composeMongoose(Employee as any);


