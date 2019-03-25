const FileResolver = require('../FileResolver');

test('resolverType is file', () =>
    expect(FileResolver.resolverType).toBe('file'));

test('telltale exists', () => expect(FileResolver.telltale).toBeDefined());

test('resolve() throws error if no definition provided', async () => {
    expect(new FileResolver().resolve({})).rejects.toThrow(
        'File argument is required'
    );
});

test('resolves filename and uses default encoding and parse', async () => {
    const visitor = {
        upward: jest.fn(() => 'in-the-way'),
        io: {
            readFile: jest.fn(() => 'ooh')
        }
    };
    await expect(
        new FileResolver(visitor).resolve({ file: 'something' })
    ).resolves.toEqual('ooh');
    expect(visitor.upward).toHaveBeenCalledTimes(1);
    expect(visitor.upward).toHaveBeenCalledWith(
        expect.objectContaining({
            file: 'something'
        }),

        'file'
    );
    expect(visitor.io.readFile).toHaveBeenCalledWith('in-the-way', 'utf8');
});

test('uses custom encoding', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => 'whats going on')
        }
    };
    visitor.upward
        .mockResolvedValueOnce('i-said')
        .mockResolvedValueOnce('latin1');
    await expect(
        new FileResolver(visitor).resolve({
            file: 'something',
            encoding: 'hey'
        })
    ).resolves.toEqual('whats going on');
    expect(visitor.upward).toHaveBeenCalledTimes(2);
    expect(visitor.upward.mock.calls).toMatchObject([
        [{ encoding: 'hey', file: 'something' }, 'file'],
        [{ encoding: 'hey', file: 'something' }, 'encoding']
    ]);
    expect(visitor.io.readFile).toHaveBeenCalledWith('i-said', 'latin1');
});

test('throws on invalid encoding', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => 'whats going on')
        }
    };
    visitor.upward
        .mockResolvedValueOnce('i-said')
        .mockResolvedValueOnce('bad-encoding');
    await expect(
        new FileResolver(visitor).resolve({
            file: 'something',
            encoding: 'hey'
        })
    ).rejects.toThrow("Invalid 'encoding'");
});

test('parse === "text" shortcuts parse', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => '{{curlies}}')
        }
    };
    visitor.upward
        .mockResolvedValueOnce('bristly.mustache')
        .mockResolvedValueOnce('text');
    await expect(
        new FileResolver(visitor).resolve({
            file: 'something',
            parse: 'text'
        })
    ).resolves.toEqual('{{curlies}}');
    expect(visitor.upward).toHaveBeenCalledWith(
        expect.objectContaining({
            parse: 'text'
        }),
        'parse'
    );
});

test('auto-parses a file from extension', async () => {
    const visitor = {
        upward: jest.fn(() => 'bristly.mustache'),
        io: {
            readFile: jest.fn(() => '{{curlies}}')
        }
    };
    const tpt = await new FileResolver(visitor).resolve({
        file: 'aTemplate'
    });
    expect(visitor.io.readFile).toHaveBeenCalledWith(
        'bristly.mustache',
        'utf8'
    );
    expect(tpt).toHaveProperty('compile', expect.any(Function));
});

test('falls back silently to text for an unrecognized file type', async () => {
    const visitor = {
        upward: jest.fn(() => 'bristly.porcupine'),
        io: {
            readFile: jest.fn(() => '\\||||////')
        }
    };
    const txt = await new FileResolver(visitor).resolve({
        file: 'aFile'
    });
    expect(visitor.io.readFile).toHaveBeenCalledWith(
        'bristly.porcupine',
        'utf8'
    );
    expect(txt).toEqual('\\||||////');
});

test('force parses a specific file type', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => '{ foo { bar } }')
        }
    };
    visitor.upward
        .mockResolvedValueOnce('graphql-disguised-by.mustache')
        .mockResolvedValueOnce('graphql');
    const gqlDoc = await new FileResolver(visitor).resolve({
        file: 'anything',
        parse: 'turns-into-graphql'
    });
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
        kind: 'Document',
        loc: {
            end: 15,
            start: 0
        }
    });
});

test('force parses throws on unrecognized file type', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => 'an executable lol')
        }
    };
    visitor.upward
        .mockResolvedValueOnce('exe-disguised-by.mustache')
        .mockResolvedValueOnce('.exe')
        // should add a dot where necessary
        .mockResolvedValueOnce('exe-disguised-by.mustache')
        .mockResolvedValueOnce('exe');
    await expect(
        new FileResolver(visitor).resolve({
            file: 'afile',
            parse: 'aparser'
        })
    ).rejects.toThrow('Unsupported parse type');
    await expect(
        new FileResolver(visitor).resolve({
            file: 'afile',
            parse: 'aparser'
        })
    ).rejects.toThrow('Unsupported parse type');
});

test('recognizes file paths', async () => {
    expect(FileResolver.recognize('not a file')).toBeFalsy();
    expect(FileResolver.recognize('./a-file')).toBeTruthy();
    expect(FileResolver.recognize('../../..//a-file')).toBeTruthy();
    const config = FileResolver.recognize('file:///a-file');
    const visitor = {
        upward: jest.fn(() => Promise.resolve('/a-file')),
        io: {
            readFile: () =>
                Promise.resolve('goodness gracious, great text of file')
        }
    };
    await expect(new FileResolver(visitor).resolve(config)).resolves.toEqual(
        'goodness gracious, great text of file'
    );
    expect(visitor.upward).toHaveBeenCalledWith(
        {
            file: { inline: '/a-file' }
        },
        'file'
    );
});

test('passes output of file compile command', async () => {
    const visitor = {
        upward: jest.fn(),
        io: {
            readFile: jest.fn(() => '{ "wut": 5 }')
        }
    };
    visitor.upward.mockResolvedValueOnce('something.json');
    const jsonDoc = await new FileResolver(visitor).resolve({
        file: 'someJSON'
    });
    expect(jsonDoc.wut).toBe(5);
});
