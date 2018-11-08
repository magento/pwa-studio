import { t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';
import { Page } from './abstract.page';

import { Header, Cart } from '../components/common';

export class HomePage extends Page {
  public readonly header = new Header(ReactSelector('Header'));
  public readonly root = ReactSelector('Query');
  public readonly cart = new Cart(ReactSelector('miniCart_MiniCart'));

  public itemList = this.root.findReact('Classify(undefined)');

  public async toggleFirstItem() {
    await t
      .click(this.itemList.nth(0));
  }
}