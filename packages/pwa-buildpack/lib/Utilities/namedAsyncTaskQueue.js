const { EventEmitter } = require('events');
const debug = require('../util/debug').makeFileLogger(__filename);

class NamedAsyncTaskQueue extends EventEmitter {
    constructor(name = '') {
        super();
        this.name = name;
        this.queue = [];
        this.errors = [];
    }
    add(task, name = '') {
        this.queue.push({ task, name });
        this._debug(
            'pushed "%s" into queue, queue is now length %s',
            name,
            this.queue.length
        );
        if (!this.running) {
            setTimeout(() => this._tick(), 0);
        }
    }
    getError() {
        if (this.errors.length === 0) {
            return null;
        }
        let message = `Errors occurred while running NamedAsyncTaskQueue[${
            this.name
        }]. ${this.queue.length} remain in queue. Original errors:\n`;
        for (const { name, msg, originalError } of this.errors) {
            message += `\n\t- Task[${name}]: ${msg}, from: ${
                originalError.stack
            }\n`;
        }
        return new Error(message);
    }
    isEmpty() {
        const empty = !this.running && this.queue.length === 0;
        this._debug('reporting isEmpty() === %s', empty);
        return empty;
    }
    _debug(msg, ...args) {
        debug(`[${this.name}] ${msg}`, ...args);
    }
    _tick() {
        if (
            !this.running &&
            this.queue.length > 0 &&
            this.errors.length === 0
        ) {
            const toRun = this.queue.shift();
            this._debug('running %s', toRun.name);
            try {
                this.emit('beforerun', toRun);
                this.running = toRun.task();
                this.emit('afterrun', toRun);
            } catch (e) {
                this._debug('%s threw synchronously! %s', toRun.name, e);
                this.errors.push({
                    name: toRun.name,
                    msg: 'threw synchronously when run',
                    originalError: e
                });
                this.running = null;
                this.emit('error', this.getError());
                return;
            }
            if (!this.running || typeof this.running.then !== 'function') {
                // didn't throw, isn't a promise, must have successfully
                // returned a sync value
                this._debug(
                    '%s synchronously returned %s',
                    toRun.name,
                    this.running
                );
                this.running = null;
                setTimeout(() => this._tick(), 0);
                return;
            }
            this.running.then(
                result => {
                    this._debug('resolved %s to %s', toRun.name, result);
                    this.running = null;
                    this._tick();
                },
                error => {
                    this.errors.push({
                        name: toRun.name,
                        msg: 'rejected',
                        originalError: error
                    });
                    this._debug('rejected %s with %s', toRun.name, error);
                    this.running = null;
                    this.emit('error', this.getError());
                }
            );
        } else {
            this.emit('empty');
        }
    }
}

module.exports = name => new NamedAsyncTaskQueue(name);
