class UpwardServerError extends Error {
    get name() {
        return 'UpwardServerError';
    }
    // constructor(originalError, message) {
    //     super(originalError);
    //     this.message = `${message}\n\t${originalError.message}`;
    //     Error.captureStackTrace(this, UpwardServerError);
    //     this.originalError = originalError;
    //     this.errno = originalError.errno;
    // }
}

module.exports = UpwardServerError;
