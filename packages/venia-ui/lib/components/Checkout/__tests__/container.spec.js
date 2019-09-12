import ConnectedCheckoutContainer from '../index';

jest.mock('../../../classify');
jest.mock('@magento/venia-drivers', () => ({
    connect: jest.fn((mapStateToProps, mapDispatchToProps) =>
        jest.fn(component => ({
            component,
            mapStateToProps,
            mapDispatchToProps
        }))
    ),
    withRouter: component => {
        component.defaultProps = {
            ...component.defaultProps,
            router: { pathname: 'mocked-path' }
        };
        return component;
    }
}));

test('returns a connected CheckoutContainer component', () => {
    expect(ConnectedCheckoutContainer.component).toBeInstanceOf(Function);
    expect(ConnectedCheckoutContainer.mapStateToProps).toBeInstanceOf(Function);
});

test('mapStateToProps correctly maps state to props', () => {
    const { mapStateToProps } = ConnectedCheckoutContainer;

    const state = {
        directory: {},
        extra: 'extra'
    };

    const props = mapStateToProps(state);
    expect(props).not.toHaveProperty('extra');
    expect(props).toMatchObject({
        directory: state.directory
    });
});
