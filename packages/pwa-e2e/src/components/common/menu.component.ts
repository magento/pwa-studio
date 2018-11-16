import { ReactComponent } from 'types/react';

import { component } from '../abstract.component';

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

export function Menu(root: Selector) {
  const signInButton: Selector = root.find('[class^="navigation-footer"]').findReact('Button');

  const toggleSignInButton = async (t: TestController) => {
    const comp = await signInButton.getReact() as SignInButtonComponent;

    await t
      .expect(comp.props.onClick).typeOf('function')
      .expect(comp.props.type).eql('button')
      .click(signInButton);
  };

  return Object.freeze({
    toggleSignInButton,
  });
}
