import React from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from '../../classify';
import Image from '../Image';
import logo from './logo.svg';

const Logo = props => {
    const { height } = props;
    const classes = mergeClasses({}, props.classes);

    return (
        <Image
            alt="Venia"
            classes={{ root: classes.logo }}
            height={height}
            src={logo}
            title="Venia"
        />
    );
};

Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number
};

Logo.defaultProps = {
    height: 24
};

export default Logo;
