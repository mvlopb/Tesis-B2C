import { orderQueries } from '@/components/order/order.controller';
import { userQueries } from '@/components/users/user.controller';
import { categoryQueries } from '@/components/category/category.controller';
import { productQueries } from '@/components/product/product.controller';
import { clientQueries } from '@/components/client/client.controller';
import { employeeQueries } from '@/components/employee/employee.controller';





export const Query = {
  ...userQueries,
  ...orderQueries,
  ...categoryQueries,
  ...productQueries,
  ...clientQueries,
  ...employeeQueries,
};
