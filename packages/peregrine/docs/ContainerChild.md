# ContainerChild

The `ContainerChild` component is the only allowed child within a `Container` in
PWA Studio.

## Usage

```jsx
import { ContainerChild } from '@magento/peregrine';

<div data-mid="some.container.identifier">
    <ContainerChild
        id="another.unique.id"
        render={() => <div>Used just like a normal render() method</div>}
    />
    <ContainerChild
        id="one.more.unique.id"
        render={() => (
            <div>Can render anything a normal component can render</div>
        )}
    />
</div>;
```

## Props

| Prop Name | Required? |                                                                                                         Description |
| --------- | :-------: | ------------------------------------------------------------------------------------------------------------------: |
| `id`      |    ✅     | A string identifier that modules/extensions can use to inject content relative to this component within a Container |
| `render`  |    ✅     |               A [render prop](https://reactjs.org/docs/render-props.html) that should return the children to render |
