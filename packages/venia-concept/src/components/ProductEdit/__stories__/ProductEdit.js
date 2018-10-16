import React from 'react';
import { storiesOf } from '@storybook/react';
import ProductEdit from '../productEdit';
import 'src/index.css';
import { configurableWithThreeOptions } from '../../ProductFullDetail/mockData';
import docs from '../__docs__/ProductEdit.md';
import { withReadme } from 'storybook-readme';

const stories = storiesOf('Product Options/Product Edit', module);

stories.add(
    'Product Edit',
    withReadme(docs, () => (
        <ProductEdit
            item={configurableWithThreeOptions.data.productDetail.items[0]}
            onOptionChange={() => {}}
        >
            Test
        </ProductEdit>
    ))
);
