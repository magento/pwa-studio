import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import Slider from '../slider';

jest.mock('@magento/peregrine/lib/util/makeUrl');
jest.mock('@magento/venia-ui/lib/classify');

jest.mock('react-slick', () => {
    return jest.fn();
});
import SlickSlider from 'react-slick';
const mockSlick = SlickSlider.mockImplementation(({ children }) => (
    <div>{children}</div>
));

test('render empty slider', () => {
    const component = createTestInstance(<Slider />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render slider with props and verify Slick is called correctly', () => {
    const sliderProps = {
        minHeight: '300px',
        autoplay: true,
        autoplaySpeed: 333,
        fade: true,
        infinite: true,
        showArrows: true,
        showDots: true
    };
    createTestInstance(<Slider {...sliderProps} />);

    expect(mockSlick).toHaveBeenCalledWith(
        expect.objectContaining({
            autoplay: true,
            autoplaySpeed: 333,
            fade: true,
            infinite: true,
            arrows: true,
            dots: true
        }),
        expect.anything()
    );
});

test('render slider overrides banner classes prop', () => {
    const mockSlideProps = {
        data: {}
    };
    const MockSlide = () => <mock-Slide />;
    const component = createTestInstance(
        <Slider>
            <MockSlide {...mockSlideProps} />
        </Slider>
    );
    const mockSlide = component.root.findByType(MockSlide);
    expect(mockSlide.props.data).toHaveProperty('classes');
});
