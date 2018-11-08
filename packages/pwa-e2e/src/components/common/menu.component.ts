import { ReactComponent } from 'types';
import { Component } from '../abstract.component';

type MenuProps = {
  categories: object
  closeDrawer: Function;
  getAllCategories: Function;
  isOpen: boolean;
  isSignedIn: boolean;
  rootCategoryId: number;
};
type MenuState = {
  isCreateAccountOpen: boolean;

  isSignInOpen: boolean;
  rootNodeId: number;
};

type MenuComponent = ReactComponent<MenuProps, MenuState>;

type SignInButtonProps = {
  children: string;
  onClick: Function;
  type: 'button';
};
type SignInButtonComponent = ReactComponent<SignInButtonProps>;

export class Menu extends Component {
  public readonly signInButton: Selector = this.root.find('[class^="navigation-footer"]').findReact('Button');

  public async toggleSignInButton(t: TestController): Promise<void> {
    const component = await this.signInButton.getReact() as SignInButtonComponent;

    await t
      .expect(component.props.onClick).typeOf('function')
      .expect(component.props.type).eql('button')
      .click(this.signInButton);
  }
}
