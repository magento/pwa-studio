const { resolve } = require('path');
const request = require('supertest');
const express = require('express');

const staticRootRoute = require('../StaticRootRoute');

test('serves the provided file at root', async () => {
    const app = express();
    app.use(
        staticRootRoute(
            resolve(__dirname, '..', '__fixtures__', 'root-available-file.json')
        )
    );
    await expect(
        request(app)
            .get('/root-available-file.json')
            .expect(200)
    ).resolves.toMatchObject({
        body: {
            goodJsonResponse: true
        }
    });
    await expect(
        request(app)
            .get('/some-other-file')
            .expect(404)
    ).resolves.toMatchObject({
        status: 404
    });
});
