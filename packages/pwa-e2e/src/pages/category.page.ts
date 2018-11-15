import { Selector, t } from 'testcafe';
import { ReactSelector } from 'testcafe-react-selectors';

import { ProductModel } from 'models';
import { ReactComponent } from 'types/react';

import { page } from './abstract.page';
import { ProductDetailPage } from './product-detail.page';

type CategoryItemListComponent = ReactComponent<{ items: ProductModel[] }, { done: boolean }>;

export function CategoryPage(url: string) {
    const categoryRoot = ReactSelector('items_GalleryItems');
    const categoryItems = Selector('[class^="item-root"]');

    const toggleFirstCategoryItem = async () => {
        return toggleCategoryItemByIndex(0);
    };

    const toggleCategoryItemByName = async (accessoryName: string) => {
        const comp = await categoryRoot.getReact<CategoryItemListComponent>();
        const index = comp.props.items.findIndex(item => item.name === accessoryName);

        const categoryItem = categoryItems.nth(index);
        const href = await categoryItem.find('a').getAttribute('href');

        await t.click(categoryItem);

        return page(ProductDetailPage)(href);
    };

    const toggleCategoryItemByIndex = async (index: number) => {
        const item = categoryItems.nth(index);
        const href = await item.find('a').getAttribute('href');
        await t.click(item);

        return page(ProductDetailPage)(href);
    };

    return Object.freeze({
        url,
        toggleFirstCategoryItem,
        toggleCategoryItemByName,
        toggleCategoryItemByIndex,
    });
}
