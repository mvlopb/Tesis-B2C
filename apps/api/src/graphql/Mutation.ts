import { userMutations } from '@/components/users/user.controller';
import { authMutations } from '@/components/auth/auth.controller';
import { orderMutations } from '@/components/order/order.controller';

export const Mutation = {
  ...userMutations,
  ...orderMutations,
  ...authMutations,
};
