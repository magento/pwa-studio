import { ReactSelector } from 'testcafe-react-selectors';

import { ReactComponent } from 'types/react';

import { Menu } from './menu.component';

type MenuProps = { openNav: Function; };
type MenuComponent = ReactComponent<MenuProps>;

type CartProps = { toggleCart: Function };
type CartComponent = ReactComponent<CartProps>;

export function Header(root: Selector) {
  const menuButton: Selector = root.findReact('[class^="header-primaryActions"]').findReact('Trigger');
  const actions: Selector = root.find('[class^="header-secondaryActions"]');
  const cart: Selector = actions.findReact('Trigger');

  const menu = Menu(ReactSelector('Navigation'));

  const toggleMenu = async (t: TestController) => {
    const comp = await menuButton.getReact<MenuComponent>();

    await t
      .expect(comp.props.openNav).typeOf('function')
      .click(menuButton);
  };

  const toggleCart = async (t: TestController) => {
    const comp = await cart.getReact<CartComponent>();

    await t.expect(comp.props.toggleCart).typeOf('function')
      .click(cart);
  };

  return Object.freeze({
    toggleMenu,
    toggleCart,
  });
}
