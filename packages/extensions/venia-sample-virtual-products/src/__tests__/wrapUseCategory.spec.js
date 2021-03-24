import wrapUseCategory from '../wrapUseCategory';

jest.mock('../category.gql', () => ({
    GET_CATEGORY: jest.fn().mockName('GET_CATEGORY')
}));

test('injects custom query into talon props', () => {
    const mockTalon = jest.fn();
    wrapUseCategory(mockTalon)({ talonProp: 'should be untouched' });

    expect(mockTalon.mock.calls[0][0]).toMatchInlineSnapshot(`
        Object {
          "operations": Object {
            "getCategoryQuery": [MockFunction GET_CATEGORY],
          },
          "talonProp": "should be untouched",
        }
    `);
});
