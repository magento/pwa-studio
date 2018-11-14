import { t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import { component } from 'components';
import { Cart, Header } from 'components/common';

import { page } from './abstract.page';
import { CategoryPage } from './category.page';

export enum Categories {
  ShopTheLook,
  Bottoms,
  Tops,
  Accessories,
  Dresses,
}

export const HomePage = (url: string) => {
  const header = component(Header)(ReactSelector('Header'));
  const root = ReactSelector('Query');
  const cart = component(Cart)(ReactSelector('miniCart_MiniCart'));

  const itemList = root.findReact('Classify(undefined)');

  const toggleFirstCategory = async () => {
    await t
      .click(itemList.nth(Categories.ShopTheLook));

    return page(CategoryPage)('/shop-the-look');
  };

  const toggleCategory = async (category: Categories) => {
    await t.click(itemList.nth(category));

    switch (category) {
      case Categories.Accessories:
        return page(CategoryPage)('/venia-accessories');

      case Categories.ShopTheLook:
        return page(CategoryPage)('/shop-the-look');

      default:
        return page(CategoryPage)('/venia-accessories');
    }
  };

  return Object.freeze({
    url,
    cart,
    itemList,
    toggleFirstCategory,
    toggleCategory,
  });
};
