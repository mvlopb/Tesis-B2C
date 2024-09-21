import { orderQueries } from '@/components/order/order.controller';
import { userQueries } from '@/components/users/user.controller';

export const Query = {
  ...userQueries,
  ...orderQueries,
};
