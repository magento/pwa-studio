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
        return new Promise((resolve, reject) => {
            try {
                const server = app.listen(port, host);

                server.on('listening', () => {
                    if (logUrl) {
                        const { address, port } = server.address();
                        console.log(`http://${address}:${port}/`);
                    }
                    resolve({
                        app,
                        server,
                        close() {
                            return new Promise(resolve => {
                                server.on('close', resolve);
                                server.close();
                            });
                        }
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }
    return { app };
};
