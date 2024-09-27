import { orderQueries } from '@/components/order/order.controller';
import { userQueries } from '@/components/users/user.controller';
import { categoryQueries } from '@/components/category/category.controller';
import { productQueries } from '@/components/product/product.controller';
import { clientQueries } from '@/components/client/client.controller';
import { employeeQueries } from '@/components/employee/employee.controller';
import { storehouseQueries } from '@/components/storehouse/storehouse.controller';
import { stockQueries } from '@/components/stock/stock.controller';
import { paymentQueries } from '@/components/payment/payment.controller';
import { administratorQueries } from '@/components/administrator/administrator.controller';
import { managerQueries } from '@/components/manager/manager.controller';
import { supportQueries } from '@/components/support/support.controller';
import { supportTicketQueries } from '@/components/supportTicket/supportTicket.controller';












export const Query = {
  ...userQueries,
  ...orderQueries,
  ...categoryQueries,
  ...productQueries,
  ...clientQueries,
  ...employeeQueries,
  ...storehouseQueries,
  ...stockQueries,
  ...paymentQueries,
  ...administratorQueries,
  ...managerQueries,
  ...supportQueries,
  ...supportTicketQueries,



};
