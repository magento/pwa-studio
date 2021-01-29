module.exports = env => (req, res, next) => {
    const oldWriteHead = res.writeHead;
    const log = env.NODE_ENV !== 'production' ? console.log : () => {};

    res.writeHead = function(statusCode) {
        oldWriteHead.apply(this, [statusCode]);

        try {
            const acceptEncoding = req.headers['accept-encoding'];

            if (acceptEncoding.split(',').includes('gzip')) {
                const contentEncoding = res.getHeader('Content-Encoding');

                if (contentEncoding !== 'gzip') {
                    log(
                        '\nGzip compression is supported by the Client. For better performance please enable gzip compression.\n'
                    );
                }
            }
        } catch (err) {
            log('GzipValidationError', err);
        }
    };

    next();
};
