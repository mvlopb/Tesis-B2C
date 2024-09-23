import type { FastifyRequest, FastifyReply } from 'fastify';
import { clientService } from '@/components/client/client.service';
import { ClientTC } from '@/components/client/client.model';

export const clientQueries = Object.freeze({
  client: ClientTC.mongooseResolvers.findOne(),
  clients: ClientTC.mongooseResolvers.findMany(),
});

export const clientMutations = Object.freeze({
  createManyClients: ClientTC.mongooseResolvers.createMany(),
  createOneClient: ClientTC.mongooseResolvers.createOne(),
  updateOneClient: ClientTC.mongooseResolvers.updateOne(),
});
