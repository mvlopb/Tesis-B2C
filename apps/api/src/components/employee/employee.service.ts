import { Employee } from '@/components/employee/employee.model';

async function findOne(args: any) {
  return Employee.findOne({ ...args });
}

async function findAll(args: any) {
  return Employee.find({ ...args });
}

export const employeeService = Object.freeze({
  findOne,
  findAll,
});
