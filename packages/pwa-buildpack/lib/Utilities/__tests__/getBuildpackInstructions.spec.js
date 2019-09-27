const getBuildpackInstructions = require('../getBuildpackInstructions');
const { resolve } = require('path');

test('gets and loads an instruction from node modules', () => {
    expect(
        getBuildpackInstructions('package-with-instruction', [
            'return-fse-readjsonsync'
        ]).instructions['return-fse-readjsonsync']({
            fs: { readJsonSync: 'foo' }
        })
    ).toBe('foo');
});

test('gets and loads an instruction from any folder', () => {
    expect(
        getBuildpackInstructions(
            resolve(
                __dirname,
                '__fixtures__',
                'non-package-folder-with-instruction'
            ),
            ['return-fse-readjsonsync']
        ).instructions['return-fse-readjsonsync']({
            fs: { readJsonSync: 'bar' }
        })
    ).toBe('bar');
});

test('throws informative error if instruction does not exist', () => {
    expect(() =>
        getBuildpackInstructions('package-with-no-instructions', [
            'return-fse-readjsonsync'
        ])
    ).toThrow('could not find');
});
