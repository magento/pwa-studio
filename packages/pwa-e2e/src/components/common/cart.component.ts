import { t } from 'testcafe';
import { PropsWithClasses, ReactComponent } from 'types/react';

import { component } from '../abstract.component';

type CartProps = PropsWithClasses<{
  cart: {
    details: {},
    guestCartId: string,
    totals: {},
  };
  cartCurrencyCode: string;
  cartId: number
  getCartDetails: Function
  isOpen: boolean;
}>;

type CartComponent = ReactComponent<CartProps>;

type CloseCartButtonProps = PropsWithClasses<{
  closeDrawer: Function;
}>;

type CloseCartButtonComponent = ReactComponent<CloseCartButtonProps>;

type CheckoutButtonProps = {
  ready: boolean;
  submit: Function;
  submitting: boolean;
};
type CheckoutButton = ReactComponent<CheckoutButtonProps>;

type CartItemsProps = {
  currencyCode: string;
  items: [];
};
type CartItemsComponent = ReactComponent<CartItemsProps>;

export function Cart(root: Selector) {
  const closeCartButton = root.findReact('trigger_Trigger');
  const checkoutButton = root.findReact('checkoutButton_CheckoutButton');
  const cartItems = root.findReact('productList_ProductList');

  const toggleCloseCart = async () => {
    const closeComponent = await closeCartButton.getReact<CloseCartButtonComponent>();
    const rootComponent = await root.getReact<CartComponent>();

    await t
      .expect(rootComponent.props.isOpen).eql(true)
      .expect(closeComponent.props.closeDrawer).typeOf('function')
      .click(closeCartButton)
      .expect(root.getReact<CartComponent>(({ props }) => props.isOpen)).eql(false);
  };

  const toggleCheckout = async () => {
    const checkoutComponent = await checkoutButton.getReact<CheckoutButton>();
    const cartItemsComponent = await cartItems.getReact<CartItemsComponent>();

    await t
      .expect(cartItemsComponent.props.items.length).gt(0)
      .expect(checkoutComponent.props.ready).eql(true)
      .click(checkoutButton);
  };

  const toggleCheckoutFromReact = async () => {
    const comp = await checkoutButton.getReact<CheckoutButton>();

    await t
      .expect(comp.props.ready).eql(true);

    comp.props.submit(); // test only.
  };

  const getCartInfo = async () => {
    //
  };

  return Object.freeze({
    toggleCloseCart,
    toggleCheckout,
    toggleCheckoutFromReact,
    getCartInfo,
  });
}
