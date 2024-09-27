import type { FastifyRequest, FastifyReply } from 'fastify';
import { administratorService } from '@/components/administrator/administrator.service';
import { AdministratorTC } from '@/components/administrator/administrator.model';

export const administratorQueries = Object.freeze({
  administrator: AdministratorTC.mongooseResolvers.findOne(),
  administrators: AdministratorTC.mongooseResolvers.findMany(),
});

export const administratorMutations = Object.freeze({
  createManyAdministrators: AdministratorTC.mongooseResolvers.createMany(),
  createOneAdministrator: AdministratorTC.mongooseResolvers.createOne(),
  updateOneAdministrator: AdministratorTC.mongooseResolvers.updateOne(),
});
