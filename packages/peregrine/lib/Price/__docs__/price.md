# Price

The `Price` component is used anywhere a price is rendered in PWA Studio.

Formatting of prices and currency symbol selection is handled entirely by the ECMAScript Internationalization API available in modern browsers. A [polyfill](https://www.npmjs.com/package/intl) will need to be loaded for any JavaScript runtime that does not have [`Intl.NumberFormat.prototype.formatToParts`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat/formatToParts).

## Usage

```jsx
import Price from '@magento/peregrine/lib/components/Price';
import cssModule from './my-pricing-styles';

<Price value={100.99} currencyCode="USD" classes={cssModule} />;
/*
    <span className="curr">$</span>
    <span className="int">88</span>
    <span className="dec">.</span>
    <span className="fract">81</span>
*/
```

## Props

| Prop Name      | Required? | Description                                                                                                                                                          |
| -------------- | :-------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `classes`      |    ❌     | A classname object.                                                                                                                                                  |
| `value`        |    ✅     | Numeric price                                                                                                                                                        |
| `currencyCode` |    ✅     | A string of with any currency code supported by [`Intl.NumberFormat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat) |
