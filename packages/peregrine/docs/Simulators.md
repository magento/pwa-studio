Simulators are testing and development components that simulate various device
conditions and network conditions that a PWA should tolerate. Use these
components only temporarily during development, as a substitute for manually
instrumenting your components with more complex lifecycle debugging.

### Contents
 - [**Progressive Load Simulators**](#progressive_load_simulators)
   - [`<DelayedValue>`](#delayed_value)
   - [`<MultipleTimedRenders>`](#multiple_timed_renders)


## Progressive Load Simulators

Data flows into React components as props, and PWAs load data progressively and
asynchronously. Therefore, PWA-ready React components should render some UI when
they have partial or empty data sets. Use these components to test how React
components display during data load, by timing re-renders.

<a id="delayed_value"></a>
### `<DelayedValue>` Component

This component passes in an `initial` data value to a component on its first
render. After a set `delay`, it will render a second time and pass an `updated`
data value. Use this behavior to simulate a progressive loading scenario on a
UI, where you would use `value` as one of the component's props or children.

#### Usage

In the following code sample, a developer has wrapped a span tag in a
`DelayedValue` to simulate progressive data load. It will initially render a
`<span>` element with the text value "Loading State...". After 1500ms, the inner
function will run again, and the component will re-render with the text changed
to "Done!"

```jsx
import { Simulators } from '@magento/peregrine';
const { DelayedValue } = Simulators;

export default class extends React.Component {
    render() {
        return (
            <div className="wrapper" data-mid="some.container">
                <DelayedValue
                    initial="Loading State..."
                    delay={1500}
                    updated="Done!"
                >
                    {status => <span>{status}</span>}
                </DelayedValue>
            </div>
        );
    }
}

```

| Prop Name | Required? | Description                                                        |
| --------- | :-------: | ------------------------------------------------------------------ |
| `delay`   |     ✅     | A `Number` representing the number of milliseconds to delay before the second render.        |
| `updated` |     ✅     | The value to pass on the delayed render.                                                     |
| `initial` |           | If this prop is present, the render function will invoke synchronously (as it would without the DelayedValue wrapper) one time when the component mounts. That initial render function call will receive the value of `initial` as its argument. If this prop is absent, there will be no initial synchronous render, only the delayed render. |
| `onError` |           | A function that will receive any errors thrown by the render. Omit to allow errors to throw uncaught. |

#### Children
`DelayedValue` does not take literal JSX nodes as children. It uses a variant of
React's [render props][1] pattern called [function-as-child][2] to render its
children asynchronously and pass  them values.

#### Example
A `Page` renders an `ExampleGallery` that will initially show only placeholders.
Its `images` prop will be an empty array.
```jsx
class Page extends React.Component {
    render() {
        return (
            <div>
                <ExampleGallery images={this.state.images} />
            </div>
        );
    }
}
```
When the images arrive from the data layer, the `Page` may set its own state.
But this is difficult to quickly test, especially if you want to observe a nice loading animation you're working on.

Use `DelayedValue` to test that out:
```jsx
import { Simulators } from '@magento/peregrine';
const { DelayedValue } = Simulators;

class Page extends React.Component {
    render() {
        return (
            <div>
                <DelayedValue
                    initial={this.state.images}
                    delay={1500}
                    updated={someMockImages}
                >
                    {images => <ExampleGallery images={images} />}
                </DelayedValue>
            </div>
        );
    }
}
```

<a id="multiple_timed_renders"></a>
### `<MultipleTimedRenders>` Component

Renders its children an arbitrary number of times, based on the length of the
array passed to the `schedule` prop. Useful for more complex load scenarios.

#### Usage
In the following code sample, a developer has wrapped a button tag in a
`MultipleTimedRenders` to simulate several state changes that will occur in
production during data load.

```jsx

import { Simulators } from '@magento/peregrine/Simulators';
const { MultipleTimedRenders } = Simulators;

<div className="wrapper" data-mid="some.container">
    <MultipleTimedRenders
        initialArgs={['loading-disabled', '']}
        scheduledArgs={[
            {
                elapsed: 0,
                args: ['loading-spinner', 'Loading...']
            },
            {
                elapsed: 2000,
                args: ['loading-spinner-faster', 'Still loading...']
            },
            {
                elapsed: 5000,
                args: ['loading-error', 'Could not load!']
            }
        ]}
    >
        {(className, label) => <button className={className}>{label}</button>}
    </MultipleTimedRenders>
</div>;

```
The presence of the `initialArgs` prop will cause a synchronous first render,
with the `initialArgs` array as arguments. The `schedule` prop will cause three
subsequent renders: one immediate, one in two seconds, and one in five seconds.

**First (sync) render**
```html
<button class="loading-disabled"></button>
```

**Second render (async, 0 seconds)**
```html
<button class="loading-spinner">Loading...</button>
```

**Third render (async, 2.0 seconds)**
```html
<button class="loading-spinner-faster">Still loading...</button>
```

**Fourth render (async, 5.0 seconds)**
```html
<button class="loading-error">Could not load!</button>
```

#### Props
| Prop Name     | Required? | Description                                                                                             |
| ------------- | :-------: | :------------------------------------------------------------------------------------------------------ |
| `schedule`    |    ✅      | An array of `{ elapsed: number, args: mixed[] }` objects saying when and with what arguments to invoke the render function passed as a child. |
| `initialArgs` |           | If this prop is present and is an array, then the render function will invoke synchronously one time, before the scheduled async updates begin. That initial sync render will receive the `initialArgs` array as arguments. If this prop is absent, there will be no initial synchronous render.     |
| `onError`     |           | A function that will receive any errors thrown by the render. Omit to allow errors to throw uncaught. |

#### Children
Like `DelayedValue`, the `MultipleTimedRenders` uses the [function-as-child][2] pattern.

[1]: https://reactjs.org/docs/render-props.html "Render Props"
[2]: https://reactjs.org/docs/render-props.html#using-props-other-than-render
"Function As Child"
