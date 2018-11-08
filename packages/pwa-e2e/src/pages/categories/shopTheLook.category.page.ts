import { t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import { ReactComponent, GraphQL } from 'types';

import { Page } from '../abstract.page';

type ShopTheLookData = GraphQL<{
  id: number;
  name: string;
  price: GraphQL<{
    regularPrice: GraphQL<{
      amount: GraphQL<{
        currency: string;
        value: number;
      }>
    }>
  }>;
  small_image: string;
  url_key: string;
}>;

type ShopTheLookProps = {
  items: Readonly<ShopTheLookData[]>;
};

type ShopTheLookState = {
  collection: {};
  done: boolean;
};

type ShopTheLookComponent = ReactComponent<ShopTheLookProps, ShopTheLookState>;

export class ShopTheLookPage extends Page {
  public readonly url = '/shop-the-look';
  public readonly root = ReactSelector('Query');
  public readonly items = this.root.findReact('gallery_Gallery').findReact('items_GalleryItems');

  public async toggleFirstItem() {
    await t
      .expect(this.items.getReact<ShopTheLookComponent>(({ props }) => props.items.length)).eql(10)
      .click(this.items.nth(0))
  }
}