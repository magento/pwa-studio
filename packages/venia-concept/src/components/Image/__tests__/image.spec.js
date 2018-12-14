import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Image from '../image';

configure({ adapter: new Adapter() });

const classes = {
    image_error: 'a',
    image: 'b',
    imagePlaceholder: 'c',
    imagePlaceholder_pending: 'd',
    image_error: 'e',
    image_pending: 'f',
    root: 'g'
};

const handleLoad = () => {};
const handleError = () => {};

const renderImagePlaceholder = props => {
    return <img src="foo.png" alt="" width="300px" height="372px" {...props} />;
};

const validImage = {
    className: classes.image,
    src: 'foo/bar/test.png',
    name: 'alt',
    onLoad: handleLoad,
    onError: handleError,
    showImage: true,
    iconHeight: '32',
    placeholder: renderImagePlaceholder
};

test('renders an image when showImage is true', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();
    const child = wrapper.find(`.${classes.image}`);

    expect(child).toHaveLength(1);
});

test('renders a placeholder image while awaiting image', () => {
    const wrapper = shallow(
        <Image
            classes={classes}
            {...validImage}
            showImage={false}
            placeholder={renderImagePlaceholder}
        />
    ).dive();
    const child = wrapper.find(`.${classes.imagePlaceholder}`);

    expect(child).toHaveLength(1);
});

test('renders placeholder pending after item is loaded', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();
    const child = wrapper.find(`.${classes.imagePlaceholder_pending}`);

    expect(child).toHaveLength(1);
});

test('renders imagePlaceholder and imagePending when `showImage: false`', () => {
    const wrapper = shallow(
        <Image classes={classes} {...validImage} showImage={false} />
    ).dive();
    const realImage = wrapper.find({ className: classes.image_pending });
    const placeholderImage = wrapper.find({
        className: classes.imagePlaceholder
    });

    expect(realImage).toHaveLength(1);
    expect(placeholderImage).toHaveLength(1);
});

test('renders error image when error is thrown', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Image
            classes={classes}
            {...validImage}
            showImage={false}
            onError={handleError}
        />
    ).dive();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('error');

    expect(handleError).toBeCalled();
    const error = wrapper.find({ className: classes.image_error }).first();
    expect(error).toHaveLength(1);
});

test('handles `load` and `error` events', () => {
    const wrapper = shallow(
        <Image classes={classes} {...validImage} showImage={false} />
    ).dive();
    const image = wrapper.find({ className: classes.image_pending }).first();

    expect(() => image.simulate('load')).not.toThrow();
    expect(() => image.simulate('error')).not.toThrow();
});

test('calls `onLoad` on image `load`', () => {
    const handleLoad = jest.fn();
    const wrapper = shallow(
        <Image
            classes={classes}
            {...validImage}
            showImage={false}
            onLoad={handleLoad}
        />
    ).dive();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('load');

    expect(handleLoad).toBeCalled();
});

test('calls `onError` on image `error`', () => {
    const handleError = jest.fn();
    const wrapper = shallow(
        <Image
            classes={classes}
            {...validImage}
            showImage={false}
            onError={handleError}
        />
    ).dive();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('error');

    expect(handleError).toBeCalled();
});
