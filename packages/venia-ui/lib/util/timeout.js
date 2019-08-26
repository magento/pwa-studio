export default time =>
    new Promise(resolve => {
        window.setTimeout(() => resolve(), time);
    });
