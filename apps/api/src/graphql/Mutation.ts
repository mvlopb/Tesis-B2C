import { userMutations } from '@/components/users/user.controller';
import { authMutations } from '@/components/auth/auth.controller';
import { orderMutations } from '@/components/order/order.controller';
import { categoryMutations } from '@/components/category/category.controller';
import { productMutations } from '@/components/product/product.controller';
import { clientMutations } from '@/components/client/client.controller';
import { employeeMutations } from '@/components/employee/employee.controller';
import { storehouseMutations } from '@/components/storehouse/storehouse.controller';
import { stockMutations } from '@/components/stock/stock.controller';
import { paymentMutations } from '@/components/payment/payment.controller';
import { supportTicketMutations } from '@/components/supportTicket/supportTicket.controller';












export const Mutation = {
  ...userMutations,
  ...orderMutations,
  ...categoryMutations,
  ...productMutations,
  ...clientMutations,
  ...employeeMutations,
  ...storehouseMutations,
  ...stockMutations,
  ...paymentMutations,
  ...supportTicketMutations,
  ...authMutations,
};
