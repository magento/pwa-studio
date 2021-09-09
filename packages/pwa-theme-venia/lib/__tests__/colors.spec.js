const { declareColors, getColors } = require('../colors');

describe('declareColors()', () => {
    test('returns the correct values with default parameters', () => {
        const colorDeclarations = declareColors();

        expect(colorDeclarations).toMatchSnapshot();
    });

    test('handles non-nested definition', () => {
        const data = {
            white: '255 255 255'
        };

        const colorDeclarations = declareColors(data);

        expect(colorDeclarations).toMatchInlineSnapshot(`
            Object {
              "--color-white": "255 255 255",
            }
        `);
    });
});

describe('getColors()', () => {
    test('returns the correct values with default parameters', () => {
        const colorConfig = getColors();

        expect(colorConfig).toMatchSnapshot();
    });

    describe('returns property functions which return the correct format with', () => {
        const data = {
            brand: {
                400: '38 128 235',
                500: '20 115 230',
                600: '13 102 208',
                700: '9 90 186'
            },
            black: '0 0 0'
        };

        const colorConfig = getColors(data);
        const { brand, black } = colorConfig;

        test('no opacity args', () => {
            const opacityArgs = {};
            expect(brand[400](opacityArgs)).toMatchInlineSnapshot(
                `"rgb(var(--color-brand-400))"`
            );
        });

        test('opacity value given', () => {
            const opacityArgs = {
                opacityValue: 0.5
            };
            expect(brand[500](opacityArgs)).toMatchInlineSnapshot(
                `"rgb(var(--color-brand-500) / 0.5)"`
            );
        });

        test('opacity variable given', () => {
            const opacityArgs = {
                opacityVariable: '--my-opacity'
            };
            expect(black(opacityArgs)).toMatchInlineSnapshot(
                `"rgb(var(--color-black) / var(--my-opacity, 1))"`
            );
        });
    });
});
