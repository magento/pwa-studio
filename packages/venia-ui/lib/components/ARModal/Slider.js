import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import MUISlider from '@material-ui/core/Slider';

function Slider(props) {
    return (
        <>
            <Typography>{props.label}</Typography>
            <MUISlider {...props} />
        </>
    );
}

export default withStyles({
    root: {
        color: '#f29c0f',
        height: 8,
        width: '250px',
        padding: '20px'
    },
    thumb: {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        marginTop: -8,
        marginLeft: -12,
        '&:focus,&:hover,&$active': {
            boxShadow: 'inherit'
        }
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 4px)'
    },
    track: {
        height: 8,
        borderRadius: 4
    },
    rail: {
        height: 8,
        borderRadius: 4
    }
})(Slider);
