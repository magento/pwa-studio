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
        query: GET_LOGO_DATA
    });
    const { logoData } = talonProps;

    if(logoData) {
        
        if(logoData && logoData.storeConfig && logoData.storeConfig.header_logo_src) {
            var defaultPath = "/media/logo/";
            var logoTempFinalSrc = logoData && logoData.storeConfig && logoData.storeConfig.header_logo_src;
            var logoFinalSrc = defaultPath+logoTempFinalSrc;
        } else {
            var logoFinalSrc = {logo};
        }
        
        if(logoData && logoData.storeConfig && logoData.storeConfig.logo_width) {
            var logoFinalWidth = logoData && logoData.storeConfig && logoData.storeConfig.logo_width;
        } else {
            var logoFinalWidth = props.width;
        }
        
        if(logoData && logoData.storeConfig && logoData.storeConfig.logo_height) {
            var logoFinalHeight = logoData && logoData.storeConfig && logoData.storeConfig.logo_height;
        } else {
            var logoFinalHeight = props.height;
        }
        
        if(logoData && logoData.storeConfig && logoData.storeConfig.logo_alt) {
            var logoFinalAlt = logoData && logoData.storeConfig && logoData.storeConfig.logo_alt;
        } else {
            var logoFinalAlt = "Venia";
        }
        
        return (
            <Image
                alt={logoFinalAlt}
                classes={{ image: classes.logo }}
                height={logoFinalHeight}
                src={logoFinalSrc}
                title={logoFinalAlt}
                width={logoFinalWidth}
            />
        );
        
    } else {

        return (
            <Image
                alt="Venia"
                classes={{ image: classes.logo }}
                height={height}
                src={logo}
                title="Venia"
                width={width}
            />
        );

    }    
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
