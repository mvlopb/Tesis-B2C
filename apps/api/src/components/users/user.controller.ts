import type { FastifyRequest, FastifyReply } from 'fastify';
import { userService } from '@/components/users/user.service';
import { UserTC } from '@/components/users/user.model';

export const userQueries = Object.freeze({
  user: UserTC.mongooseResolvers.findOne(),
  users: UserTC.mongooseResolvers.findMany(),
});

export const userMutations = Object.freeze({
  createManyUsers: UserTC.mongooseResolvers.createMany(),
  createOneUser: UserTC.mongooseResolvers.createOne(),
  updateOneUser: UserTC.mongooseResolvers.updateOne(),
});
