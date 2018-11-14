import { Role } from 'testcafe';
import { waitForReact } from 'testcafe-react-selectors';

import { config } from 'configs';
import { Categories, CategoryPage, HomePage, ProductDetailPage, dynamicPage, page } from 'pages';
import { UrlUtils } from 'utils';

const homePage = page(HomePage)('/');

fixture`Checkout`
  .before(async ctx => ctx.config = config)
  .page(config.baseUrl)
  .beforeEach(async t => {
    await t.useRole(Role.anonymous());
    await waitForReact();
  });

test.skip('buying configurable product', async t => {

  const shopTheLookPage = await homePage.toggleFirstCategory();

  await shopTheLookPage.toggleFirstCategoryItem();

  const productDetail = await dynamicPage(ProductDetailPage)(UrlUtils.getUrl());

  await t.wait(5000);
  await productDetail.toggleAddToCart();
  await homePage.cart.toggleCheckout();
});

test('buying non-configurable product', async t => {
  const accessoriesPage = await homePage.toggleCategory(Categories.Accessories);
  const carminaEarringsDetailPage = await accessoriesPage.toggleFirstCategoryItem();

  const productInfo = (await carminaEarringsDetailPage.getProductInfo()).props.product;
  const cart = await carminaEarringsDetailPage.toggleAddToCart();
  
  await t.wait(5000);
});
