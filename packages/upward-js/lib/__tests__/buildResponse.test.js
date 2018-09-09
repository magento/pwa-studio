const buildResponse = require('../buildResponse');
const { getScenarios } = require('@magento/upward-spec');

let scenarios, mockIO;
beforeAll(async () => {
    scenarios = await getScenarios(/static\-servers/);
    mockIO = {
        readFile: jest.fn(scenarios.getResource)
    };
});

const stubRequest = () => ({
    url: 'http://example.com/nowhere?special',
    query: {
        special: undefined
    },
    headers: {
        host: 'example.com',
        'content-type': 'text/plain'
    },
    get(header) {
        return this.headers[header];
    }
});

test('builds a response from a static definition', async () => {
    const definition = await scenarios.getDefinition('hello-inline-only');
    return expect(
        buildResponse(mockIO, process.env, definition, stubRequest())
    ).resolves.toMatchObject({
        status: 200,
        headers: {
            'content-type': 'text/plain'
        },
        body: 'Hello World!!'
    });
});

test('handles implicit resolvers', async () => {
    const definition = await scenarios.getDefinition(
        'hello-inline-implicit-resolvers'
    );
    return expect(
        buildResponse(mockIO, process.env, definition, stubRequest())
    ).resolves.toMatchObject({
        status: 200,
        headers: {
            'content-type': 'text/plain'
        },
        body: 'Hello World, concisely!!'
    });
});

test('handles env interpolation', async () => {
    const definition = await scenarios.getDefinition('hello-env-interpolation');
    return expect(
        buildResponse(
            mockIO,
            { UPWARD_TEST_RESPONSE_BODY: 'Hello, environment!' },
            definition,
            stubRequest()
        )
    ).resolves.toMatchObject({
        status: 200,
        headers: {
            'content-type': 'text/plain'
        },
        body: 'Hello, environment!'
    });
});

test('handles inline templates', async () => {
    const definition = await scenarios.getDefinition(
        'hello-env-inline-template'
    );
    return expect(
        buildResponse(mockIO, { ADDRESSEE: 'Earth' }, definition, stubRequest())
    ).resolves.toMatchObject({
        status: 200,
        headers: {
            'content-type': 'text/plain'
        },
        body: 'Hello, environment of Earth!!'
    });
});

test('handles file resolvers and context interpolation', async () => {
    const definition = await scenarios.getDefinition(
        'hello-env-context-file-template'
    );
    return expect(
        buildResponse(mockIO, { sender: 'world' }, definition, stubRequest())
    ).resolves.toMatchObject({
        status: 200,
        headers: {
            'content-type': 'text/plain'
        },
        body: 'Hello from a world of external templates!!'
    });
});

test('handles deep template resolvers, can return json', async () => {
    const definition = await scenarios.getDefinition(
        'hello-context-inline-template-json'
    );
    const response = await buildResponse(
        mockIO,
        {
            ADDRESSEE: 'deep space'
        },
        definition,
        stubRequest()
    );
    expect(response).toMatchObject({
        status: 200,
        headers: {
            'content-type': 'application/json'
        }
    });
    expect(response.body).toEqual(
        JSON.stringify({
            greeting: 'Hello',
            subject: 'the depths of deep space...',
            shouldYouReallyHandwriteJSON: 'no'
        })
    );
});

// test.skip('makes GQL queries');

// test.skip('conditionally resolves');

// test.skip('conditional resolution falls through in order');

// test.skip('conditional resolution yields to default');

// test.skip('responds to request data');
