import { Selector, t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import { ProductDetailModel } from 'models/product-detail.model';
import { PropsWithRootClasses, ReactComponent } from 'types/react';

import { Cart, component } from 'components';
import { SelectorUtils } from 'utils';

type ProductDetailProps = PropsWithRootClasses<{ addToCart: () => Promise<void>; product: ProductDetailModel }>;
type ProductDetailComponent = ReactComponent<ProductDetailProps, { quantity: number }>;

export const ProductDetailPage = (url: string) => {
    const root = ReactSelector('ProductFullDetail_ProductFullDetail');

    const imageCarousel = root.findReact('carousel_Carousel');
    const carouselImages = ReactSelector('items_Items');
    const carouselCurrentImage = imageCarousel.find('img[class^="carousel-currentImage"]');

    const addToCartButton = Selector('section[class^="productFullDetail-cartActions"]').find('button');

    const toggleAddToCart = async () => {
        await SelectorUtils.scrollTo({ x: 0, y: 500 });
        await t.click(addToCartButton);

        return component(Cart)(ReactSelector('miniCart_MiniCart'));
    };

    const getProductInfo = async () => {
        return await root.getReact<ProductDetailComponent>();
    };

    return Object.freeze({
        url,
        toggleAddToCart,
        getProductInfo,
    });
};
