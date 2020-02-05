import React from 'react';

import Tone from './Tone';
import classes from './Hue.css';

const Hue = props => {
    const { hue, tones } = props;

    const toneElements = Array.from(tones, ([tone, value]) => (
        <Tone key={tone} hue={hue} tone={tone} value={value} />
    ));

    return <div className={classes.root}>{toneElements}</div>;
};

export default Hue;
