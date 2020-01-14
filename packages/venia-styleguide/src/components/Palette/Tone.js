import React, { useMemo } from 'react';

import { getHex, getLightness } from '../../util/contrastUtils';
import finalizeClasses from '../../util/finalizeClasses';
import classes from './Tone.css';

const WHITE = getLightness([255, 255, 255]);

const Tone = props => {
    const { hue, tone, value } = props;
    const style = { '--tone': value };

    // determine whether a value is light or dark
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
