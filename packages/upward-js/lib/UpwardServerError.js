class UpwardServerError extends Error {
    get name() {
        return 'UpwardServerError';
    }
    constructor(originalError, message) {
        super(originalError);
        this.message += ' -- ' + message;
    }
}

module.exports = UpwardServerError;
