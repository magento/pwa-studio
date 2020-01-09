import React, { useMemo } from 'react';

import finalizeClasses from '../../util/finalizeClasses';
import classes from './Tone.css';

const getHex = channel => parseInt(channel).toString(16);

const getSRGB = channel => {
    const factor = channel / 255;

    return factor <= 0.03928
        ? factor / 12.92
        : Math.pow((factor + 0.055) / 1.055, 2.4);
};

const getLightness = channels => {
    const [r, g, b] = channels.map(getSRGB);

    return r * 0.2126 + g * 0.7152 + b * 0.0722;
};

const WHITE = getLightness([255, 255, 255]);

const Tone = props => {
    const { hue, tone, value } = props;
    const style = { '--tone': value };

    const channels = useMemo(() => value.split(' '), [value]);
    const lightness = getLightness(channels);
    const ratio = WHITE / (lightness + 0.05);
    const balance = ratio < 3 ? 'light' : 'dark';

    const finalClasses = finalizeClasses(classes, { balance });
    const hex = channels.map(channel => getHex(channel)).join('');

    return (
        <div className={finalClasses.get('root')} style={style}>
            <span className={classes.label}>{`${hue} ${tone}`}</span>
            <span className={classes.value}>{`#${hex}`}</span>
        </div>
    );
};

export default Tone;
