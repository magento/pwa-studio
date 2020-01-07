---
title: Component State
---

We'll create a simple [controlled form element][] for our Foo component to demonstrate how [component state][] is used in React.    

{: .bs-callout .bs-callout-info}
controlled form elements are similar to KnockoutJS observables use in Magento2.

First add the state object to the Foo component and a function to handle when it changes.

```javascript
class Foo extends Component {
  state = {
    name: ''
  };

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };
    
  // other code...
```

Then add the following JSX:

```jsx
<hr className={classes.spacer}/>
<p className={classes.label}>A React controlled input element:</p>
<input type="text" value={this.state.name} onChange={this.handleChange}/>
<div>{this.state.name}</div>
```

Now test this element on the storefront and see how it automatically updates as you type into the input element.

## Learn more

-   [controlled form element][]
-   [component state][]

[controlled form element]: https://reactjs.org/docs/forms.html#controlled-components
[component state]: https://reactjs.org/docs/faq-state.html
