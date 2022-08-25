export let add = (x, y) => {
    return x + y;
};

export function multiply(x, y) {
    let result = y;
    while (--x) {
        result = add(result, y);
    }
    return result;
}

const exps = {
    square(x) {
        return multiply(x, x);
    }
};

export default exps.square;
