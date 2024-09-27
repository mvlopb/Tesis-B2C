import { model } from 'mongoose';
import { hash } from 'argon2';
import { composeMongoose } from 'graphql-compose-mongoose';
import { userSchema } from '@avila-tek/models';

/**a
 * @async a
 * @function a
 * @description Hashes password with module argon2 before saving it in database every time it is modified a
 * @listens userSchema:save a
 * @param next {CallbackWithoutResultAndOptionalError} a
 * @requires argon2 a
 * @since 1.0.0 a
 * @summary Hashes password a
 * @version 1 a
  a */ 
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = (await hash(this.password!, {})).toString();
  next();
});

export const User = model('User', userSchema);
export const UserTC = composeMongoose(User as any);
