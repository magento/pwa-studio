import React from 'react';
import { storiesOf } from '@storybook/react';
import { withReadme } from 'storybook-readme';
import Price from '../Price';
import docs from '../__docs__/Price.md';

const stories = storiesOf('Price', module);

stories.add(
    'USD',
    withReadme(docs, () => <Price value={100.99} currencyCode="USD" />)
);

stories.add(
    'EUR',
    withReadme(docs, () => <Price value={100.99} currencyCode="EUR" />)
);

stories.add(
    'JPY',
    withReadme(docs, () => <Price value={100.99} currencyCode="JPY" />)
);

stories.add(
    'Custom Styles',
    withReadme(docs, () => {
        const classes = {
            currency: 'curr',
            integer: 'int',
            decimal: 'dec',
            fraction: 'fract'
        };
        return (
            <div>
                <style>{`
                    .curr { color: green; font-weight: bold; }
                    .int { color: red; }
                    .dec { color: black; }
                    .fract { color: blue; }
                `}</style>
                <Price value={100.99} currencyCode="USD" classes={classes} />
            </div>
        );
    })
);
