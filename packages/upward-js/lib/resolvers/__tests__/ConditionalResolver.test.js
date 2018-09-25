const ConditionalResolver = require('../ConditionalResolver');

test('resolverType is conditional', () =>
    expect(ConditionalResolver.resolverType).toBe('conditional'));

test('telltale exists', () =>
    expect(ConditionalResolver.telltale).toBe('when'));

test(`throws if the when list is absent or empty`, async () =>
    expect(new ConditionalResolver().resolve({})).rejects.toThrow(
        "'when' list"
    ));

test(`throws if the default is not present`, async () =>
    await expect(
        new ConditionalResolver().resolve({
            when: [
                { matches: 'request.url.pathname', pattern: '^/derp' },
                { use: { inline: 'lerp' } }
            ]
        })
    ).rejects.toThrow('default'));

test(`resolves a matcher and yields a value`, async () => {
    const visitor = {
        upward: jest.fn((x, y) => [x, y]),
        context: {
            get: jest.fn(
                name =>
                    ({
                        'one.fish': 'blue',
                        'red.fish': 'two'
                    }[name])
            ),
            set: jest.fn(),
            forget: jest.fn()
        }
    };
    await expect(
        new ConditionalResolver(visitor).resolve({
            when: [
                {
                    matches: 'one.fish',
                    pattern: 'green',
                    use: { inline: '#00FF00' }
                },
                {
                    matches: 'red.fish',
                    pattern: 'tw.',
                    use: { inline: '#FF0000' }
                }
            ],
            default: { inline: 'chum' }
        })
    ).resolves.toMatchObject([
        {
            matches: 'red.fish',
            pattern: 'tw.',
            use: { inline: '#FF0000' }
        },
        'use'
    ]);
});

test(`when no matchers match, yields default`, async () => {
    const visitor = {
        upward: jest.fn((x, y) => [x, y]),
        context: {
            get: jest.fn(
                name =>
                    ({
                        'one.fish': 'blue',
                        'red.fish': 'two'
                    }[name])
            ),
            set: jest.fn(),
            forget: jest.fn()
        }
    };
    await expect(
        new ConditionalResolver(visitor).resolve({
            when: [
                {
                    matches: 'one.fish',
                    pattern: 'green',
                    use: { inline: '#00FF00' }
                },
                {
                    matches: 'red.fish',
                    pattern: 'thr',
                    use: { inline: '#FF0000' }
                },
                {
                    matches: 'one.fish',
                    pattern: 'lemons',
                    use: { inline: '#00FF00' }
                },
                {
                    matches: 'red.fish',
                    pattern: 'noooo',
                    use: { inline: '#FF0000' }
                }
            ],
            default: { inline: 'chum' }
        })
    ).resolves.toMatchObject([
        {
            default: { inline: 'chum' }
        },
        'default'
    ]);
});

test(`context values for match are temporarily present`, async () => {
    const visitor = {
        upward: jest.fn(() => {
            expect(visitor.context.set).toHaveBeenCalledWith(
                '$match',
                expect.objectContaining({
                    $0: 'blu',
                    $1: 'l',
                    $2: 'u'
                }),
                true
            );
            return 'match set';
        }),
        context: {
            get: jest.fn(
                name =>
                    ({
                        'one.fish': 'blue',
                        'red.fish': 'two'
                    }[name])
            ),
            set: jest.fn(),
            forget: jest.fn()
        }
    };
    await expect(
        new ConditionalResolver(visitor).resolve({
            when: [
                {
                    matches: 'one.fish',
                    pattern: 'b(l)(u)',
                    use: { inline: '#00FF00' }
                },
                {
                    matches: 'red.fish',
                    pattern: 'noooo',
                    use: { inline: '#FF0000' }
                }
            ],
            default: { inline: 'chum' }
        })
    ).resolves.toEqual('match set');
    expect(visitor.context.forget).toHaveBeenCalledWith('$match');
});
