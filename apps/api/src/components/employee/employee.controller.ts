import type { FastifyRequest, FastifyReply } from 'fastify';
import { employeeService } from '@/components/employee/employee.service';
import { EmployeeTC } from '@/components/employee/employee.model';

export const employeeQueries = Object.freeze({
  employee: EmployeeTC.mongooseResolvers.findOne(),
  employees: EmployeeTC.mongooseResolvers.findMany(),
});

export const employeeMutations = Object.freeze({
  createManyEmployees: EmployeeTC.mongooseResolvers.createMany(),
  createOneEmployee: EmployeeTC.mongooseResolvers.createOne(),
  updateOneEmployee: EmployeeTC.mongooseResolvers.updateOne(),
});
