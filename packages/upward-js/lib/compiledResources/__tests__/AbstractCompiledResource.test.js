const AbstractCompiledResource = require('../AbstractCompiledResource');

test('requires override to static supportedExtensions getter', () => {
    expect(() => AbstractCompiledResource.supportedExtensions).toThrow(
        'must define static supported'
    );
});

test('cannot be directly instantiated', () => {
    expect(() => new AbstractCompiledResource()).toThrow('Cannot instantiate');
});

test('sets source and io properties from constructor args', () => {
    const source = '';
    const io = {};
    const compiler = new class extends AbstractCompiledResource {}(source, io);
    expect(compiler.source).toBe(source);
    expect(compiler.io).toBe(io);
});

test('throws if it receives no source argument', () => {
    expect(() => new class extends AbstractCompiledResource {}()).toThrow(
        'string source'
    );
});

test('requires override to compile method', () => {
    const rsrc = new class extends AbstractCompiledResource {}('');
    expect(rsrc.compile()).rejects.toThrow('must define a compile');
});

test('requires override to render method', () => {
    const rsrc = new class extends AbstractCompiledResource {}('');
    expect(rsrc.render()).rejects.toThrow('must define a render');
});
