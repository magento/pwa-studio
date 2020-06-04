export default function printAsBinary(op) {
    return (...args) => op(...args).toString(2);
}
