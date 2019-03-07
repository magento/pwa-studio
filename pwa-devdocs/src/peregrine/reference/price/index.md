---
title: Price
---

<!-- 
The reference doc content is generated automatically from the source code.
To update this section, update the doc blocks in the source code
-->
{% include auto-generated/peregrine/src/Price/Price.md %}

## Example

```jsx
import Price from '@peregrine/Price';
import cssModule from './my-pricing-styles';

<Price value={100.99} currencyCode="USD" classes={cssModule} />;
/*
    <span className="curr">$</span>
    <span className="int">88</span>
    <span className="dec">.</span>
    <span className="fract">81</span>
*/
```
