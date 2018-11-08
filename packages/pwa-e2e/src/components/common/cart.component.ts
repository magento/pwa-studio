import { t } from 'testcafe';
import { PropsWithClasses, ReactComponent } from 'types';

import { Component } from '../abstract.component';

type CartProps = PropsWithClasses<{
  cart: object;
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

export class Cart extends Component {

  public readonly closeCartButton = this.root.findReact('trigger_Trigger');
  public readonly checkoutButton = this.root.findReact('checkoutButton_CheckoutButton');
  public readonly cartItems = this.root.findReact('productList_ProductList');

  public async toggleCloseCart() {
    const closeComponent = await this.closeCartButton.getReact<CloseCartButtonComponent>();
    const rootComponent = await this.root.getReact<CartComponent>();

    await t
      .expect(rootComponent.props.isOpen).eql(true)
      .expect(closeComponent.props.closeDrawer).typeOf('function')
      .click(this.closeCartButton)
      .expect(this.root.getReact<CartComponent>(({ props }) => props.isOpen)).eql(false);
  }

  public async toggleCheckout() {
    const checkoutComponent = await this.checkoutButton.getReact<CheckoutButton>();
    const cartItemsComponent = await this.cartItems.getReact<CartItemsComponent>();

    await t
      .takeScreenshot('./sceenshots')
      .expect(cartItemsComponent.props.items.length).gt(0)
      .expect(checkoutComponent.props.ready).eql(true)
      .click(this.checkoutButton);
  }

  public async toggleCheckoutFromReact() {
    const component = await this.checkoutButton.getReact<CheckoutButton>();

    await t
      .expect(component.props.ready).eql(true);

    component.props.submit.call(this); // test only.
  }
}
