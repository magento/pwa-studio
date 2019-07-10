const camelize = str =>
    str.replace(/\-([a-z])?/, m => (m[1] ? m[1].toUpperCase() : ''));

export default camelize;
