const FileResolver = require('../FileResolver');
const fs = require('fs');
const path = require('path');
const getStream = require('get-stream');

const fixture = name => path.resolve(__dirname, '__fixtures__', name);

test('resolverType is file', () =>
    expect(FileResolver.resolverType).toBe('file'));

test('telltale exists', () => expect(FileResolver.telltale).toBeDefined());

test('resolve() throws error if no definition provided', async () => {
    expect(new FileResolver().resolve({})).rejects.toThrow(
        'File argument is required'
    );
});

const visitor = {
    fakeContextValues: {},
    io: {
        createReadFileStream: jest
            .fn()
            .mockName('mockVisitor.io.createReadFileStream')
            .mockImplementation(async (filename, opts) =>
                fs.createReadStream(fixture(filename), {
                    encoding: (opts && opts.encoding) || opts
                })
            ),
        getFileSize: jest
            .fn()
            .mockName('mockVisitor.io.getFileSize')
            .mockImplementation(
                async filename => fs.statSync(fixture(filename)).size
            )
    },
    upward: jest
        .fn()
        .mockName('mockVisitor.upward')
        .mockImplementation(
            async (node, name) => visitor.fakeContextValues[node[name]]
        )
};

beforeEach(() => {
    visitor.fakeContextValues = {};
    visitor.upward.mockClear();
    visitor.io.createReadFileStream.mockClear();
});

test('resolves filename and returns stream', async () => {
    visitor.fakeContextValues = {
        sounds: './oohs.unknownExt'
    };

    const lyricsFile = await new FileResolver(visitor).resolve({
        file: 'sounds'
    });
    const lyricsStream = await lyricsFile.asStream();

    // fileResolver asks visitor what 'oohs' is in context
    expect(visitor.upward).toHaveBeenCalledTimes(1);
    expect(visitor.upward).toHaveBeenCalledWith(
        expect.objectContaining({
            file: 'sounds'
        }),
        'file'
    );

    // visitor tells FileResolver that 'oohs' is './lyrics.unknownExt'
    expect(visitor.io.createReadFileStream).toHaveBeenCalledWith(
        './oohs.unknownExt',
        undefined
    );

    const lyrics = await getStream.buffer(lyricsStream);
    expect(lyrics).toBeInstanceOf(Buffer);
    expect(lyrics.toString('utf8')).toBe('ooh, ooh\n');
});

test('uses custom encoding', async () => {
    visitor.fakeContextValues = {
        'i-said': './heys.unknownExt',
        enc: 'utf8'
    };

    debugger;
    const lyricsFile = await new FileResolver(visitor).resolve({
        file: 'i-said',
        encoding: 'enc'
    });

    const lyricsStream = await lyricsFile.asStream();

    // FileResolver asks visitor for name and encoding
    expect(visitor.upward).toHaveBeenCalledTimes(2);
    expect(visitor.upward.mock.calls).toMatchObject([
        [{ encoding: 'enc', file: 'i-said' }, 'file'],
        [{ encoding: 'enc', file: 'i-said' }, 'encoding']
    ]);

    expect(visitor.io.createReadFileStream).toHaveBeenCalledWith(
        './heys.unknownExt',
        'utf8'
    );

    const lyrics = await getStream(lyricsStream);
    expect(lyrics).toBe('HEEEEY-EEEY-YAAAAAAH-AH-AHHHHH\n');
});

test('throws on invalid encoding', async () => {
    visitor.fakeContextValues = {
        'i-said': './heys.unknownExt',
        enc: 'bad-encoding'
    };

    await expect(
        new FileResolver(visitor).resolve({
            file: 'i-said',
            encoding: 'enc'
        })
    ).rejects.toThrow("Invalid 'encoding'");
});

test('infers encoding from extension', async () => {
    visitor.fakeContextValues = {
        'i-said-hey': './whats-up.mst'
    };

    const lyricsFile = await new FileResolver(visitor).resolve({
        file: 'i-said-hey'
    });

    // FileResolver asks visitor for name only
    expect(visitor.upward).toHaveBeenCalledTimes(1);

    expect(lyricsFile.compile).toBeInstanceOf(Function);

    await lyricsFile.compile();

    expect(visitor.io.createReadFileStream).toHaveBeenCalledWith(
        './whats-up.mst',
        undefined
    );

    await expect(lyricsFile.render()).resolves.toBe('WHATS GOIN ON');
});

test('parse === "text" shortcuts parse and sets encoding', async () => {
    visitor.fakeContextValues = {
        something: './bristly.mustache',
        parseAs: 'text'
    };

    const textFile = await new FileResolver(visitor).resolve({
        file: 'something',
        parse: 'parseAs'
    });

    await expect(textFile.asBuffer()).resolves.toBe('{{curlies}}\n');

    expect(visitor.io.createReadFileStream).toHaveBeenCalledWith(
        './bristly.mustache',
        'utf8'
    );
});

test.skip('auto-parses a file from extension', async () => {
    visitor.fakeContextValues = {
        aTemplate: './bristly.mustache'
    };

    const tpt = await new FileResolver(visitor).resolve({
        file: 'aTemplate'
    });

    expect(visitor.io.createReadFilestream).toHaveBeenCalledWith(
        './bristly.mustache',
        expect.objectContaining({ encoding: 'utf8' })
    );

    expect(tpt).toHaveProperty('compile', expect.any(Function));
});

test('force parses a specific file type', async () => {
    visitor.fakeContextValues = {
        anything: './graphql-file-as-txt.txt',
        forceGraphQL: 'graphql'
    };

    const gqlDoc = await new FileResolver(visitor).resolve({
        file: 'anything',
        parse: 'forceGraphQL'
    });
    expect(gqlDoc).toMatchObject({
        compile: expect.any(Function),
        render: expect.any(Function)
    });

    expect(gqlDoc.compile()).resolves.not.toThrow();
    expect(gqlDoc.render()).resolves.toMatchObject({
        definitions: [
            {
                directives: [],
                kind: 'OperationDefinition',
                name: undefined,
                operation: 'query',
                selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                        {
                            alias: undefined,
                            arguments: [],
                            directives: [],
                            kind: 'Field',
                            name: {
                                kind: 'Name',
                                value: 'foo'
                            },
                            selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                    {
                                        alias: undefined,
                                        arguments: [],
                                        directives: [],
                                        kind: 'Field',
                                        name: {
                                            kind: 'Name',
                                            value: 'bar'
                                        },
                                        selectionSet: undefined
                                    }
                                ]
                            }
                        }
                    ]
                },
                variableDefinitions: []
            }
        ],
        kind: 'Document'
    });
});

test('force parse throws on unrecognized file type', async () => {
    visitor.fakeContextValues = {
        anything: './graphql-file-as-txt.txt',
        forceEXE: 'exe'
    };

    await expect(
        new FileResolver(visitor).resolve({
            file: 'anything',
            parse: 'forceEXE'
        })
    ).rejects.toThrow('Unsupported parse type');
});

test('recognizes file path shortcuts', async () => {
    expect(FileResolver.recognize('not a file')).toBeFalsy();
    expect(FileResolver.recognize('./a-file')).toBeTruthy();
    expect(FileResolver.recognize('../../..//a-file')).toBeTruthy();
    expect(FileResolver.recognize('file:///a-file')).toBeTruthy();

    const config = FileResolver.recognize('./davem.png');
    // shortcut to mocking inline upward, which would make this test longer
    visitor.upward.mockResolvedValueOnce('./davem.png');

    const dave = fs.readFileSync(fixture('davem.png'));

    const imageStream = await new FileResolver(visitor).resolve(config);

    await expect(imageStream.asBuffer()).resolves.toEqual(dave);

    expect(visitor.upward).toHaveBeenCalledWith(
        {
            file: { inline: './davem.png' }
        },
        'file'
    );
});
