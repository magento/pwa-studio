const MustacheTemplate = require('../MustacheTemplate');
const AbstractCompiledResource = require('../AbstractCompiledResource');
const stringToStream = require('from2-string');

test('supported extensions include standard .mst and .mustache', () => {
    expect(MustacheTemplate.supportedExtensions).toEqual(
        expect.arrayContaining(['.mst', '.mustache'])
    );
});

test('extends AbstractCompiledResource concretely', () => {
    const io = {
        readFile: () => {}
    };
    const instantiate = () => new MustacheTemplate('', io);
    expect(instantiate).not.toThrow();
    expect(instantiate()).toBeInstanceOf(AbstractCompiledResource);
});

test('throws if IOInterface is not present or lacks methods at constructor time', () => {
    expect(() => new MustacheTemplate('')).toThrow(
        'IOAdapter as second argument'
    );
});

test('compiles Mustache ', async () => {
    const template = new MustacheTemplate(
        `
            {{#existenz}}
                Existenz is {{status}}!
            {{/existenz}}
            {{^existenz}}
            What, you hate Cronenberg?
            {{/existenz}}
        `,
        { readFile: () => {} }
    );
    await expect(template.compile()).resolves.not.toThrow();
    await expect(
        template.render({ existenz: { status: 'paused' } })
    ).resolves.toEqual('Existenz is paused!');
    await expect(
        template.render({
            existenz: [
                { status: 'a movie with a weird goop gun in it' },
                { status: 'overshadowed by The Matrix' }
            ]
        })
    ).resolves.toEqual(
        `Existenz is a movie with a weird goop gun in it!
                Existenz is overshadowed by The Matrix!`
    );
    await expect(template.render({})).resolves.toEqual(
        'What, you hate Cronenberg?'
    );
    await expect(template.render()).resolves.toEqual(
        'What, you hate Cronenberg?'
    );
});

test('loads Mustache partials using io', async () => {
    const io = {
        createReadFileStream: jest.fn(async name =>
            stringToStream(
                `<h2>Hello {{addressee}}, I am the template called ${name}!</h2>`
            )
        ),
        getFileSize() {
            return {
                size: 200
            };
        }
    };
    const template = new MustacheTemplate(
        `
        <h1>Important announcements!</h1>
        {{> firstPartial}}
        {{> secondPartial}}
    `,
        io
    );
    await expect(template.compile()).resolves.not.toThrow();
    await expect(template.render({ addressee: 'unit test' })).resolves.toEqual(
        `<h1>Important announcements!</h1>
        <h2>Hello unit test, I am the template called firstPartial.mst!</h2>        <h2>Hello unit test, I am the template called secondPartial.mst!</h2>`
    );
    expect(io.createReadFileStream).toHaveBeenCalledTimes(2);
    expect(io.createReadFileStream.mock.calls).toMatchObject([
        ['firstPartial.mst', 'utf8'],
        ['secondPartial.mst', 'utf8']
    ]);
});

test('caches seen partials and loads descendent partials using io', async () => {
    const io = {
        createReadFileStream: jest.fn(async name =>
            stringToStream(
                name.indexOf('subPartial') !== -1
                    ? `I'm a subpartial, {{addressee}}!!`
                    : `<h2>Hello {{addressee}}, I am the template called ${name}, and I have sub-partials!</h2> {{> subPartial}}`
            )
        ),
        getFileSize() {
            return {
                size: 200
            };
        }
    };
    const template = new MustacheTemplate(
        `
    <h1>Important announcements!</h1>
    {{> firstPartial}}
    {{> thirdPartial}}
`,
        io
    );
    await expect(template.compile()).resolves.not.toThrow();
    await expect(template.render({ addressee: 'unit test' })).resolves.toEqual(
        `<h1>Important announcements!</h1>
    <h2>Hello unit test, I am the template called firstPartial.mst!</h2>    <h2>Hello unit test, I am the template called thirdPartial.mst, and I have sub-partials!</h2> I'm a subpartial, unit test!!`
    );
    expect(io.createReadFileStream).toHaveBeenCalledTimes(2);
    expect(io.createReadFileStream.mock.calls).toMatchObject([
        ['thirdPartial.mst', 'utf8'],
        ['subPartial.mst', 'utf8']
    ]);
});

test('handles missing partials', async () => {
    const io = {
        readFile: jest.fn(async () =>
            Promise.reject(new Error('Everything is very bad'))
        )
    };
    const template = new MustacheTemplate(
        `{{> aPartial}} will never exist`,
        io
    );
    await expect(template.compile()).rejects.toThrowError(
        'Error in template partials'
    );
});

test('handles partial errors', async () => {
    const io = {
        readFile: jest.fn(async () => '{{/katzs}} never closes!i809ula/sn')
    };
    const template = new MustacheTemplate(`{{> aPartial }} ought to close`, io);
    await expect(template.compile()).rejects.toThrowError(
        'Error in template partials'
    );
});
