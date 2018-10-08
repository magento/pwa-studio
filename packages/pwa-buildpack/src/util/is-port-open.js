const net = require('net');

const addresses = ['0.0.0.0', '::']; // handle ipv4 and ipv6
async function isPortOpen(port) {
    return new Promise(resolve => {
        const servers = [];
        const timeout = setTimeout(finish(false), 2000);
        function finish(isOpen) {
            return () => {
                clearTimeout(timeout);
                servers.forEach(server => {
                    try {
                        server.close();
                    } catch (e) {}
                });
                resolve(isOpen);
            };
        }
        Promise.all(
            addresses.map(
                address =>
                    new Promise((innerResolve, innerReject) => {
                        try {
                            const server = net.createServer();
                            return server
                                .once('error', innerReject)
                                .once('listening', () => {
                                    servers.push(server);
                                    innerResolve(server);
                                })
                                .listen(port, address);
                        } catch (e) {
                            innerReject(e);
                        }
                    })
            )
        ).then(finish(true), finish(false));
    });
}

module.exports = isPortOpen;
