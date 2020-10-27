module.exports = Operation =>
    class PrependOperation extends Operation {
        run(path) {
            path.unshiftContainer('children', [this.jsx]);
        }
    };
