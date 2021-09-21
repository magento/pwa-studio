const RootShimmerTypes = require('../RootShimmerTypes');

const mockAdd = jest.fn();
const targetable = {
    esModuleObject: jest.fn(() => ({
        add: mockAdd
    }))
};

test('adds new root shimmer component', () => {
    const target = new RootShimmerTypes(targetable);
    target.add({
        shimmerType: 'FOO_SHIMMER',
        importPath: './dog.js'
    });

    expect(mockAdd.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "import FOO_SHIMMER from './dog.js'",
        ]
    `);
});
