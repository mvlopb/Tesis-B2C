import { userMutations } from '@/components/users/user.controller';
import { authMutations } from '@/components/auth/auth.controller';
import { orderMutations } from '@/components/order/order.controller';
import { categoryMutations } from '@/components/category/category.controller';
import { productMutations } from '@/components/product/product.controller';
import { clientMutations } from '@/components/client/client.controller';
import { employeeMutations } from '@/components/employee/employee.controller';





export const Mutation = {
  ...userMutations,
  ...orderMutations,
  ...categoryMutations,
  ...productMutations,
  ...clientMutations,
  ...employeeMutations,
  ...authMutations,
};
