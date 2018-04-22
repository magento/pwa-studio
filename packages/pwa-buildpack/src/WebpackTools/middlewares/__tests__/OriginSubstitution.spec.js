const { URL } = require('url');
const request = require('supertest');
const express = require('express');

const originSubstitution = require('../OriginSubstitution');

test('swaps origins in html', async () => {
    const app = express();
    const backendUrl = new URL('https://old.backend:8080');
    const frontendUrl = new URL('https://cool.frontend:8081');
    app.use(originSubstitution(backendUrl, frontendUrl));
    const htmlWithBaseDomain = base =>
        `
        <!doctype html>
        <html>
            <head>
                <link rel="stylesheet" href="${base}/style.css">
                <style>
                    body {
                        background-image: url(${base}/image.jpg)
                    }
                </style>
            </head>
            <body style="background-image: url(${base}/image.jpg)">
                    <img src="${base}/image2.png">
                    <a href="${base}">Home</a>
            </body>
        </html>
    `.trim();
    app.get('/', (req, res) => res.send(htmlWithBaseDomain(backendUrl)));
    await expect(request(app).get('/')).resolves.toMatchObject({
        text: htmlWithBaseDomain(frontendUrl)
    });
});
