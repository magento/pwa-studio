import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import FooterTile from './footerTile';
import { footerTilePropType } from './constants';
import defaultClasses from './footer.css';

const footerBlocks = [
    {
        iconName: 'user',
        //TODO: find out link to My Account page
        headerTitle: () => <Link to="/">Your Account</Link>,
        bodyText: 'Sign up and get access to our wonderful rewards program.'
    },
    {
        iconName: 'instagram',
        headerTitle: () => <Link to="/">Follow Us On Instagram</Link>,
        bodyText:
            'See what the Venia tribe is up to, and add your stories to the mix.'
    },
    {
        iconName: 'map-pin',
        headerTitle: () => <Link to="/">Store Locator</Link>,
        bodyText:
            'Find the one closest to you from over 1200 locations worldwide.'
    },
    {
        iconName: 'phone-call',
        headerTitle: 'Customer Support',
        bodyText: 'Call us, chat, email us, FAQs and more.'
    }
];

class Footer extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            copyright: PropTypes.string,
            root: PropTypes.string,
            tile: PropTypes.string,
            tileBody: PropTypes.string,
            tileTitle: PropTypes.string
        }),
        footerBlocksItems: PropTypes.arrayOf(footerTilePropType)
    };

    static defaultProps = {
        footerBlocksItems: footerBlocks
    };

    render() {
        const { classes, footerBlocksItems } = this.props;

        return (
            <footer className={classes.root}>
                {footerBlocksItems.map(
                    ({ iconName, headerTitle, bodyText }, index) => (
                        <FooterTile
                            key={index}
                            item={{ iconName, headerTitle, bodyText }}
                        />
                    )
                )}
                <div className={classes.copyright}>
                    <span>© Magento 2018. All rights reserved.</span>
                </div>
            </footer>
        );
    }
}

export default classify(defaultClasses)(Footer);
