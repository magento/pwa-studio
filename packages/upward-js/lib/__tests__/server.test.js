jest.mock('morgan', () => () => (_, __, next) => next());
const { Server } = require('http');
const supertest = require('supertest');
const { getScenarios } = require('@magento/upward-spec');
const createUpwardServer = require('../createUpwardServer');

let upwardPath;
beforeAll(async () => {
    upwardPath = (await getScenarios(/static\-servers/)).getResourcePath(
        'hello-inline-only.yml'
    );
});

test('returns app alone if bindLocal is false', async () => {
    const { app, server } = await createUpwardServer({ upwardPath });
    expect(app).toBeTruthy();
    expect(server).not.toBeDefined();
});

test('returns app and server if bindLocal is true', async () => {
    const { app, server, close } = await createUpwardServer({
        upwardPath,
        bindLocal: true
    });
    expect(app).toBeTruthy();
    expect(server).toBeInstanceOf(Server);
    await close();
});

test('responds to requests based on UPWARD config', async () => {
    const { app } = await createUpwardServer({ upwardPath });
    const response = await supertest(app).get('/article?articleId=1');
    expect(response.statusCode).toBe(200);
    expect(response.text).toEqual('Hello World!!');
});
