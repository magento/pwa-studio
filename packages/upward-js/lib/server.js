const { resolve } = require('path');
const express = require('express');
const middleware = require('./middleware');
const morgan = require('morgan');
module.exports = async function upwardServer({
    bindLocal,
    logUrl,
    upwardPath
}) {
    if (!upwardPath) {
        throw new Error(`upwardPath is required`);
    }
    const app = express();
    const loggerConfig =
        process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(loggerConfig));
    app.use(await middleware(resolve(upwardPath)));
    if (bindLocal) {
        const server = app.listen(0, '0.0.0.0');
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
