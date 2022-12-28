module.exports = Operation =>
    class AppendOperation extends Operation {
        run(path) {
            path.pushContainer('children', [this.jsx]);
        }
    };
