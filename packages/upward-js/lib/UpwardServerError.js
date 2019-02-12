class UpwardServerError extends Error {
    get name() {
        return 'UpwardServerError';
    }
    constructor(originalError, message) {
        super(originalError);

        if (message) {
            this.message += ' -- ' + message;
        }
    }
}

module.exports = UpwardServerError;
