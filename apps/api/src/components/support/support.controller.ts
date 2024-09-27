import type { FastifyRequest, FastifyReply } from 'fastify';
import { supportService } from '@/components/support/support.service';
import { SupportTC } from '@/components/support/support.model';

export const supportQueries = Object.freeze({
  support: SupportTC.mongooseResolvers.findOne(),
  supports: SupportTC.mongooseResolvers.findMany(),
});

export const supportMutations = Object.freeze({
  createManySupports: SupportTC.mongooseResolvers.createMany(),
  createOneSupport: SupportTC.mongooseResolvers.createOne(),
  updateOneSupport: SupportTC.mongooseResolvers.updateOne(),
});
