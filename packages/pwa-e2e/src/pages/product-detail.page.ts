import { Selector, t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import { ReactComponent } from 'types';
import { SelectorUtils } from 'utils';

import { Page } from './abstract.page';

type AddToCartButtonProps = {
    children: { props: { children: string; }; };
};

type AddToCartButtonComponent = ReactComponent<AddToCartButtonProps>;

export class ProductDetailPage extends Page {
    public readonly root = ReactSelector('Query').findReact('ProductFullDetail_ProductFullDetail');

    public readonly imageCarousel = this.root.findReact('carousel_Carousel');
    public readonly carouselImages = ReactSelector('items_Items');
    public readonly carouselCurrentImage = this.imageCarousel.find('img[class^="carousel-currentImage"]');

    public readonly addToCartButton = ReactSelector('section').nth(4).findReact('button_Button');

    public constructor(baseUrl: string) {
        super(baseUrl, '/valeria-two-layer-tank');
    }

    public async toggleAddToCart() {
        await t.wait(5000);

        SelectorUtils.scrollTo(0, 500);

        await t
            .click(this.addToCartButton);
    }
}
