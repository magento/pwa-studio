import React from 'react';

import Hue from './Hue';
import classes from './Palette.css';

const Palette = props => {
    const { colors } = props;
    const { hues } = colors;

    const hueElements = Array.from(hues, ([hue, tones]) => (
        <Hue key={hue} hue={hue} tones={tones} />
    ));

    return <figure className={classes.root}>{hueElements}</figure>;
};

export default Palette;
