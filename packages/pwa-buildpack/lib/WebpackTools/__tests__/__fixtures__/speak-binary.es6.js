const onlyBinary = /^[01]+$/;
export default function speakBinary(op) {
    return (...args) => {
        const digits = op(...args);
        if (typeof digits === 'string' && onlyBinary.test(digits)) {
            return digits
                .split('')
                .map(d => (d === '0' ? 'zero' : 'one'))
                .join(' ');
        }
        throw new Error('I only speak binary');
    };
}
