import { Role } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import { config } from 'configs';
import { CategoryPage, HomePage, Page, ProductDetailPage, ShopTheLookPage } from 'pages';

const { baseUrl } = config;

const homePage = new HomePage(baseUrl, '/');
const categoryPage = Page.toPage<CategoryPage<ShopTheLookPage>>(CategoryPage);
const shopTheLookPage = categoryPage.toCategory(ShopTheLookPage);
const productDetail = new ProductDetailPage(baseUrl);

fixture`Checkout`
  .page(homePage.fullUrl)
  .beforeEach(async () => await waitForReact());

test('buying product', async t => {

  await t.useRole(Role.anonymous());
  await homePage.toggleFirstItem();

  await shopTheLookPage.toggleFirstItem();

  // tslint:disable-next-line:no-debugger
  debugger;
  await t.wait(5000);
  await productDetail.toggleAddToCart();
  await homePage.cart.toggleCheckout();

});
