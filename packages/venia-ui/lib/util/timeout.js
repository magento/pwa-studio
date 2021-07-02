export default time =>
    new Promise(resolve => {
        globalThis.setTimeout(() => resolve(), time);
    });
