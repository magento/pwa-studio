const getBuildpackInstructions = require('../getBuildpackInstructions');
const { resolve } = require('path');

test('gets and loads an instruction from node modules', async () => {
    const { instructions } = await getBuildpackInstructions(
        'package-with-instruction',
        ['return-fse-readjsonsync']
    );
    expect(
        instructions['return-fse-readjsonsync']({
            fs: { readJsonSync: 'foo' }
        })
    ).toBe('foo');
});

test('throws informative error if package.json does not exist', async () => {
    await expect(
        getBuildpackInstructions(
            resolve(
                __dirname,
                '../../__tests__/__fixtures__',
                'non-package-folder-with-instruction'
            ),
            ['return-fse-readjsonsync']
        )
    ).rejects.toThrow('valid package');
});

test('throws informative error if instruction does not exist', async () => {
    await expect(
        getBuildpackInstructions('package-with-no-instructions', [
            'return-fse-readjsonsync'
        ])
    ).rejects.toThrow('could not find');
});
