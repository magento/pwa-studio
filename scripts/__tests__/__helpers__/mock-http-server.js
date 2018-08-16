const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

module.exports = handler => {
    const app = express();
    app.use(bodyParser.text({ type: () => true }));
    app.use('/', (req, res) => {
        const mockProps = handler({
            method: req.method,
            body: req.body
        });
        if (typeof mockProps.body === 'string') {
            res.status(mockProps.status).send(mockProps.body);
        } else {
            res.status(mockProps.status).json(mockProps.body);
        }
    });
    const server = http.createServer(app);
    return {
        mount() {
            return new Promise((res, rej) => {
                try {
                    server.listen(0, '0.0.0.0', () => {
                        try {
                            const { port, address } = server.address();
                            res(`http://${address}:${port}/`);
                        } catch (e) {
                            rej(e);
                        }
                    });
                } catch (e) {
                    rej(e);
                }
            });
        },
        unmount() {
            return new Promise((res, rej) => {
                try {
                    server.close(res);
                } catch (e) {
                    rej(e);
                }
            });
        }
    };
};
