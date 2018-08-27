const express = require('express');
const middleware = require('./middleware');
const morgan = require('morgan');
module.exports = async function upwardServer({
    bindLocal,
    logUrl,
    upwardPath
}) {
    const app = express();
    const loggerConfig =
        process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(loggerConfig));
    app.use(await middleware(upwardPath));
    if (bindLocal) {
        const server = app.listen();
        if (logUrl) {
            server.on('listening', () => {
                console.log(`http://${server.address()}:${server.port}`);
            });
        }
    } else {
        return app;
    }
};
