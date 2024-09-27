import { model } from 'mongoose';
import { composeMongoose } from 'graphql-compose-mongoose';
import { clientSchema } from '@avila-tek/models';
import { User } from '../users/user.model';



export const Client = User.discriminator('Client', clientSchema)
export const ClientTC = composeMongoose(Client as any);


