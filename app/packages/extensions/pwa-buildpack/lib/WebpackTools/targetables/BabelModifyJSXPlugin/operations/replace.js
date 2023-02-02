module.exports = Operation =>
    class ReplaceOperation extends Operation {
        setup() {
            this.state.seen = new Set();
        }
        run(path) {
            if (!this.state.seen.has(path.node)) {
                this.state.seen.add(path.node);
                path.replaceWith(this.jsx);
            }
        }
    };
