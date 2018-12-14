const ResolverVisitor = require('../ResolverVisitor');
const File = require('../File');
const stringToStream = require('from2-string');

const mockIO = () => ({
    createReadFileStream: jest.fn(),
    getFileSize: jest.fn(),
    networkFetch: jest.fn()
});

const mockContext = () => ({
    setVisitor: jest.fn(),
    get: jest.fn()
});

test('binds itself to supplied context', async () => {
    const context = mockContext();
    const visitor = new ResolverVisitor(null, null, context);
    expect(context.setVisitor).toHaveBeenCalledWith(visitor);
});

test('.upward() errors on a value not found in definition', async () => {
    const visitor = new ResolverVisitor(null, null, mockContext());
    await expect(visitor.upward({}, 'foo')).rejects.toThrow(
        "Context value 'foo' not defined"
    );
});

test('.upward() derives resolvers from shortcut strings', async () => {
    const io = mockIO();
    const context = mockContext();
    context.get.mockRejectedValue('Should have resolved FileResolver shortcut');
    io.createReadFileStream.mockResolvedValueOnce(stringToStream('sepia'));
    const visitor = new ResolverVisitor(io, null, context);
    const file = await visitor.upward(
        { cuttlefish: './ink.txt' },
        'cuttlefish'
    );
    expect(file).toBeInstanceOf(File);
    const buf = await file.asBuffer();
    await expect(buf.toString('utf8')).toBe('sepia');
    expect(io.createReadFileStream).toHaveBeenCalledWith(
        './ink.txt',
        undefined
    );
    expect(context.get).not.toHaveBeenCalled();
});

test('.upward() gets primitive from context', async () => {
    const context = mockContext();
    context.get.mockResolvedValueOnce('green');
    const visitor = new ResolverVisitor(null, null, context);
    await expect(visitor.upward({ foo: 'bar' }, 'foo')).resolves.toBe('green');
    expect(context.get).toHaveBeenCalledWith('bar');
});

test('.upward() errors on a non-primitive, non-object value', async () => {
    const visitor = new ResolverVisitor(null, null, mockContext());
    await expect(visitor.upward({ foo: () => {} }, 'foo')).rejects.toThrow(
        'Unexpected value'
    );
});

test('.upward() finds resolvers using `resolver` property', async () => {
    const visitor = new ResolverVisitor(mockIO(), null, mockContext());
    await expect(
        visitor.upward(
            { foo: { resolver: 'inline', inline: 'fighters' } },
            'foo'
        )
    ).resolves.toEqual('fighters');
});

test('.upward() throws on an unrecognized `resolver` property', async () => {
    const visitor = new ResolverVisitor(mockIO(), null, mockContext());
    await expect(
        visitor.upward({ foo: { resolver: 'wat', no: 'really?' } }, 'foo')
    ).rejects.toThrow('Unrecognized resolver type');
});

test('.upward() derives resolver from telltale property', async () => {
    const visitor = new ResolverVisitor(mockIO(), null, mockContext());
    await expect(
        visitor.upward({ foo: { inline: 'fighters' } }, 'foo')
    ).resolves.toEqual('fighters');
});

test('.upward() throws if it cannot derive a resolver strategy', async () => {
    const visitor = new ResolverVisitor(mockIO(), null, mockContext());
    await expect(
        visitor.upward({ foo: { hopeless: 'case' } }, 'foo')
    ).rejects.toThrow('Unrecognized configuration. Could not match a resolver');
});

test('.downward() calls visitor.upward() with root definition', async () => {
    const context = mockContext();
    context.get.mockResolvedValueOnce('green');
    const visitor = new ResolverVisitor(null, { frog: 'kermit' }, context);
    await expect(visitor.downward(['frog'])).resolves.toEqual({
        frog: 'green'
    });
    expect(context.get).toHaveBeenCalledWith('kermit');
});
