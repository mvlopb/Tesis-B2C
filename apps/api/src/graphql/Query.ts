import { orderQueries } from '@/components/order/order.controller';
import { userQueries } from '@/components/users/user.controller';
import { categoryQueries } from '@/components/category/category.controller';
import { productQueries } from '@/components/product/product.controller';



export const Query = {
  ...userQueries,
  ...orderQueries,
  ...categoryQueries,
  ...productQueries,
};
