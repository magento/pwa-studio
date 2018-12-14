/**
 * General purpose representation of a file over io.createReadFileStream. The
 * IOAdapter needs only to implement `createReadFileStream` and `getFileSize`;
 * this higher-level file manager reduces overall IO load and excessive
 * stream<=>buffer transformation.
 */
const LRUCache = require('lru-cache');
const fileCache = new LRUCache({
    max: 1.049e7, // 10MiB
    length: file => file.size
});
const getStream = require('get-stream');
const streamFrom = require('from2');

// i better watch it with this encoding
function toStream(stringOrBuf) {
    if (typeof stringOrBuf == 'string') {
        let str = stringOrBuf;
        return streamFrom((size, next) => {
            if (str.length <= 0) {
                return next(null, null);
            }
            const chunk = str.slice(0, size);
            str = str.slice(size);
            next(null, chunk);
        });
    }
    let pointer = 0;
    return streamFrom((size, next) => {
        if (pointer >= buf.length) {
            return next(null, null);
        }
        const lastPointer = pointer;
        pointer = pointer + size;
        next(null, buf.slice(lastPointer, pointer));
    });
}

function streamToBuffer(stream, encoding) {
    return encoding
        ? getStream(stream, { encoding })
        : getStream.buffer(stream);
}

class File {
    static async readToEnd(value) {
        if (value instanceof File) {
            return value.asBuffer();
        }
        if (Buffer.isBuffer(value) || typeof value === 'string') {
            return value;
        }
        throw new Error(
            `File.readToEnd() argument must be a File, Buffer, or string, but was ${typeof value} ${Object.prototype.toString.call(
                value
            )}`
        );
    }
    static async create(io, path, enc) {
        const cached = fileCache.get(path);
        if (cached) {
            return cached;
        }
        const size = await io.getFileSize(path);
        const file = new File(io, path, size, enc);
        fileCache.set(path, file);
        return file;
    }
    constructor(io, path, size, enc) {
        this.io = io;
        this.path = path;
        this.size = size;
        this.enc = enc;
    }
    async asStream() {
        if (this._buffer) {
            return toStream(await this._buffer);
        }
        return this.io.createReadFileStream(this.path, this.enc);
    }
    async asBuffer() {
        if (!this._buffer) {
            this._buffer = streamToBuffer(await this.asStream(), this.enc);
        }
        return this._buffer;
    }
}

module.exports = File;
