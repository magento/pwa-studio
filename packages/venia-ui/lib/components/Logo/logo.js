import React from 'react';
import PropTypes from 'prop-types';
import { mergeClasses } from '../../classify';
import Image from '../Image';
import logo from './logo.svg';
import { useLogo } from '@magento/peregrine/lib/talons/Logo/useLogo';
import GET_LOGO_DATA from '../../queries/getStoreConfigData.graphql';

/**
 * A component that renders a logo in the header.
 *
 * @typedef Logo
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
const Logo = props => {
    const { height, width } = props;
    const classes = mergeClasses({}, props.classes);

    const talonProps = useLogo({
        query: GET_LOGO_DATA,
        defaultSrc: logo,
        defaultWidth: width,
        defaultHeight: height,
        defaultAlt: 'Venia Logo'
    });
    const { configSrc, configWidth, configHeight, configAlt } = talonProps;

    return (
        <Image
            alt={configAlt}
            classes={{ image: classes.logo }}
            height={configHeight}
            src={configSrc}
            title={configAlt}
            width={configWidth}
        />
    );
};

/**
 * Props for {@link Logo}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Logo component.
 * @property {string} classes.logo classes for logo
 * @property {number} height the height of the logo.
 */
Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number
};

Logo.defaultProps = {
    height: 24,
    width: 48
};

export default Logo;
