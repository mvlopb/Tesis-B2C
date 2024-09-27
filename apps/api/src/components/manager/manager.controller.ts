import type { FastifyRequest, FastifyReply } from 'fastify';
import { managerService } from '@/components/manager/manager.service';
import { ManagerTC } from '@/components/manager/manager.model';

export const managerQueries = Object.freeze({
  manager: ManagerTC.mongooseResolvers.findOne(),
  managers: ManagerTC.mongooseResolvers.findMany(),
});

export const managerMutations = Object.freeze({
  createManyManagers: ManagerTC.mongooseResolvers.createMany(),
  createOneManager: ManagerTC.mongooseResolvers.createOne(),
  updateOneManager: ManagerTC.mongooseResolvers.updateOne(),
});
