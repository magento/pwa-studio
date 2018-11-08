import { ReactSelector } from 'testcafe-react-selectors';

import { ReactComponent } from 'types';

import { Component } from '../abstract.component';
import { Menu } from './menu.component';

type MenuProps = { openNav: Function; };
type MenuComponent = ReactComponent<MenuProps>;

type CartProps = { toggleCart: Function };
type CartComponent = ReactComponent<CartProps>;

export class Header extends Component {
  public readonly menuButton: Selector = this.root.findReact('[class^="header-primaryActions"]').findReact('Trigger');
  public readonly actions: Selector = this.root.find('[class^="header-secondaryActions"]');
  public readonly cart: Selector = this.actions.findReact('Trigger');

  public readonly menu: Menu = new Menu(ReactSelector('Navigation'));

  public async toggleMenu(t: TestController): Promise<void> {
    const component = await this.menuButton.getReact<MenuComponent>();

    await t
      .expect(component.props.openNav).typeOf('function')
      .click(this.menuButton);
  }

  public async toggleCart(t: TestController): Promise<void> {
    const component = await this.cart.getReact<CartComponent>();

    await t.expect(component.props.toggleCart).typeOf('function')
      .click(this.cart);
  }
}
