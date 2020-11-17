const TargetableESModule = require('../TargetableESModule');

const fileToTransform = './to-be-wrapped.js';
const fakeModule = new TargetableESModule(fileToTransform, () => {});

test('adds a wrapper file to the default export', () => {
    fakeModule.wrapWithFile('@module/path/to/wrapperFile');
    const transforms = fakeModule.flush();
    expect(transforms).toHaveLength(1);
    expect(transforms[0]).toMatchObject({
        type: 'source',
        fileToTransform,
        transformModule: expect.stringContaining('wrap'),
        options: {
            defaultExport: true,
            wrapperModule: '@module/path/to/wrapperFile'
        }
    });
});

test('adds a wrapper file to a named export', () => {
    fakeModule.wrapWithFile('myExport', '@module/path/to/wrapperFile');
    const transforms = fakeModule.flush();
    expect(transforms).toHaveLength(1);
    expect(transforms[0]).toMatchObject({
        type: 'source',
        fileToTransform,
        transformModule: expect.stringContaining('wrap'),
        options: {
            defaultExport: false,
            exportName: 'myExport',
            wrapperModule: '@module/path/to/wrapperFile'
        }
    });
});
