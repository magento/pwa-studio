import React from 'react';
import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useStyle } from '../../classify';
import defaultLogo from './B2BStoreLogo.svg';

import defaultClasses from './logo.module.css';
import getLogo from '@magento/peregrine/lib/RestApi/Configuration/getLogo';

/**
 * A component that renders a logo in the header.
 *
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a logo.
 */
const Logo = props => {
    const { height, width } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const [logo, setLogo] = useState(null);

    useEffect(() => {
        if (process.env.MULTITENANT_ENABLED === 'false') {
            setLogo(defaultLogo);
        } else {
            const getLogoFrom = async () => {
                const response = await getLogo();
                const blob = await response.blob();
                setLogo(URL.createObjectURL(blob));
            };
            getLogoFrom();
        }
    }, []);

    const title = formatMessage({ id: 'logo.title', defaultMessage: 'Venia' });

    return <img src={logo} alt={title} title={title} className={classes.image} />;
};

/**
 * Props for the Logo component.
 *
 * @kind props
 *
 * @property {Object} classes An object containing the class names for the Logo component.
 * @property {string} classes.logo Classes for logo
 * @property {number} [height=18] Height of the logo.
 * @property {number} [width=102] Width of the logo.
 */
Logo.propTypes = {
    classes: PropTypes.shape({
        logo: PropTypes.string
    }),
    height: PropTypes.number,
    width: PropTypes.number
};

Logo.defaultProps = {
    height: 48,
    width: 144
};

export default Logo;
