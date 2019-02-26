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

const renderImagePlaceholder = props => {
    return <img src="foo.png" alt="" width="300px" height="372px" {...props} />;
};

const validImage = {
    className: classes.image,
    src: 'foo/bar/test.png',
    alt: 'alt',
    iconHeight: '32',
    placeholder: renderImagePlaceholder
};

test('renders an image when showImage is true', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();
    wrapper.setState({ showImage: true });

    const child = wrapper.find(`.${classes.image}`);

    expect(child).toHaveLength(1);
});

test('renders a placeholder image while awaiting image', () => {
    const wrapper = shallow(
        <Image
            classes={classes}
            {...validImage}
            placeholder={renderImagePlaceholder}
        />
    ).dive();
    wrapper.setState({ showImage: false });

    const child = wrapper.find(`.${classes.imagePlaceholder}`);

    expect(child).toHaveLength(1);
});

test('renders placeholder pending after item is loaded', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();
    wrapper.setState({ showImage: true });

    const child = wrapper.find(`.${classes.imagePlaceholder_pending}`);

    expect(child).toHaveLength(1);
});

test('renders imagePlaceholder and imagePending when `showImage: false`', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();
    wrapper.setState({ showImage: false });

    const realImage = wrapper.find({ className: classes.image_pending });
    const placeholderImage = wrapper.find({
        className: classes.imagePlaceholder
    });

    expect(realImage).toHaveLength(1);
    expect(placeholderImage).toHaveLength(1);
});

test('renders error image when error is thrown', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();

    const onError = jest.spyOn(wrapper.instance(), 'onError');
    wrapper.instance().forceUpdate();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('error');

    expect(onError).toHaveBeenCalled();
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
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();

    const onLoad = jest.spyOn(wrapper.instance(), 'onLoad');
    wrapper.instance().forceUpdate();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('load');

    expect(onLoad).toHaveBeenCalled();
});

test('calls `onError` on image `error`', () => {
    const wrapper = shallow(<Image classes={classes} {...validImage} />).dive();

    const onError = jest.spyOn(wrapper.instance(), 'onError');
    wrapper.instance().forceUpdate();

    wrapper
        .find({ className: classes.image_pending })
        .first()
        .simulate('error');

    expect(onError).toHaveBeenCalled();
});
