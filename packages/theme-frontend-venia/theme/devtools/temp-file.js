const fs = require('fs');
const debug = require('util').debuglog('tempfile');
const tmp = require('tmp');
tmp.setGracefulCleanup();
class TempFile {
    constructor(contents, postfix) {
        this._file = tmp.fileSync({
            discardDescriptor: true,
            postfix,
            tries: 100
        });
        this.path = this._file.name;
        if (contents) {
            this.write(contents);
        }
    }
    write(contents) {
        fs.writeFileSync(this.path, contents, 'utf8');
        this.contents = contents;
    }
    read() {
        this.contents = fs.readFileSync(this.path, 'utf8');
        return this.contents;
    }
    destroy() {
        try {
            this._file.removeCallback();
            this.contents = undefined;
            debug(`TempFile deleted at ${this.path}`);
        } catch (e) {
            debug(`Unable to delete TempFile at ${this.path}`);
        }
    }
}
module.exports = TempFile;
