import { GraphQL } from 'types';

import { PriceModel } from './price.model';

export type ProductModel = GraphQL<{
  id: number;
  name: string;
  price: PriceModel;
  small_image: string;
  url_key: string;
}>;
