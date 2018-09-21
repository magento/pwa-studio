const { resolve } = require('path');
const express = require('express');
const middleware = require('./middleware');
const debugErrorMiddleware = require('debug-error-middleware').express;
const morgan = require('morgan');
module.exports = async function upwardServer({
    bindLocal,
    port = 0,
    host = '0.0.0.0',
    logUrl,
    upwardPath
}) {
    if (!upwardPath) {
        throw new Error(`upwardPath is required`);
    }
    const app = express();
    const upward = await middleware(resolve(upwardPath));
    if (process.env.NODE_ENV === 'production') {
        app.use(morgan('combined'));
        app.use(upward);
    } else {
        app.use(morgan('dev'));
        app.use(upward);
        app.use(debugErrorMiddleware());
    }
    if (bindLocal) {
        const server = app.listen(port, host);
        if (logUrl) {
            server.on('listening', () => {
                const { address, port } = server.address();
                console.log(`http://${address}:${port}/`);
            });
        }
        return { app, server };
    }
    return { app };
};
