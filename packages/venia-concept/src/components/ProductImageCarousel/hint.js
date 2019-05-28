import React from 'react';
import PropTypes from 'prop-types';

function Hint({ isTouchDetected, hintTextMouse, hintTextTouch }) {
    return (
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                position: 'absolute',
                bottom: '10px'
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '5px 10px',
                    backgroundColor: '#FFF',
                    borderRadius: '10px',
                    opacity: '0.80'
                }}
            >
                <img
                    style={{
                        width: '20px',
                        height: '20px',
                        opacity: '0.50'
                    }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAQAAACROWYpAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfjAwcOMwEPgflJAAACgklEQVQ4y5XUb2jUZRwA8M/pLm6128UEN93cC7VB/ttI9m7CGJOYpFQQvalejcQwfJFMEcGIIKR3QRRbCzzqhfhu0NZWIHTlbq4Sul44ZcFstpss8dz07nakvRmy8+5+cN9XP75fPr/v832ehyekONq9qlerRvct+t2IMQ9ViNC67w7ndbvsO3+5o1aLLkfU+MiQgsB4V17cVg3ect4FnxnQIeQNsyY1BdHPLenW4isFN8R96gs/yvvTYVEjbtleiX5gSZted416aW32bpvUOyNjUERcSrQc7ZDTrVfWiSe5C3L+87392lx3ScSkoXJ4wpda3F1HYaN2cXlHNbttwF55u5+m7fK2GDZadqA35bymz32NvjX8dPlDYxoU1mYtjZMW1Eo465AlNcXFn73vbTcqnsMz/tDpuKsissUtNthm1h7JinjVPtOS9siZ11qMN1vUaDHgDvT4RFqt56WLL0uNFVHL6gLwVXPqPfJArVxx5wVb/e2FALxi1k7/KGixUIyv6TLhgHpB8Yof7LDZr8Xp183bIOVMAG2yrMfp0m19Vto7Dstoq0BDLhoXMae/tPieOVGDrmsuSz+W1uqcGeHSctgVIyIuua2vZMEXpXU6aNVU+TNpcktcxIBlCcd1avaiIwatGNfqoHtOSUqU59ulTNqn0VnTsh57ZN7XekScU3AKMalKPGrIqm8cEkFMGDucNmfGlKSYPlmzlTi7DLsj66afTFv0WFK/sDoJKVnHxNYvPlTyg43abdMkL23av2vZOmO22C8jZlxBnxVVxHMu+00DYib9Uv5Fq4KHquJRo8JelhEzYaa63kQlJMXQJVMtpk7ClAOGA16fQB6XkbTrf+22yEYTr+AhAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAzLTA3VDEzOjUxOjAxKzAxOjAwKiZFxgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMy0wN1QxMzo1MTowMSswMTowMFt7/XoAAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC"
                    alt=""
                />
                <span
                    style={{
                        padding: '2px 0 0 5px',
                        fontFamily: 'Arial, sans-serif',
                        fontSize: '12px',
                        color: 'gray'
                    }}
                >
                    {isTouchDetected ? hintTextTouch : hintTextMouse}
                </span>
            </div>
        </div>
    );
}

Hint.displayName = 'DefaultHint';

Hint.propTypes = {
    isTouchDetected: PropTypes.bool,
    hintTextMouse: PropTypes.string,
    hintTextTouch: PropTypes.string
};

export default Hint;
