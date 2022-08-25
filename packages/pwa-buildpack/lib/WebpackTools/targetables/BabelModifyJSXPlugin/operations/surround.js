module.exports = Operation =>
    class SurroundOperation extends Operation {
        run(path) {
            const originalNode = path.node;
            path.replaceWith(this.jsx);
            path.pushContainer('children', [originalNode]);
        }
    };
