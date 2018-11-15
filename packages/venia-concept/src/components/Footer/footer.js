import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import CmsBlock from 'src/components/CmsBlock';
import FooterTiles from './footerTiles';
import { footerLinksIdentifier } from './constants';
import defaultClasses from './footer.css';

class Footer extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            copyright: PropTypes.string,
            root: PropTypes.string,
            tile: PropTypes.string,
            tileBody: PropTypes.string,
            tileTitle: PropTypes.string
        })
    };

    render() {
        const { classes } = this.props;

        return (
            <footer className={classes.root}>
                <CmsBlock identifiers={footerLinksIdentifier}>
                    {FooterTiles}
                </CmsBlock>
                <div className={classes.copyright}>
                    <span>© Magento 2018. All rights reserved.</span>
                </div>
            </footer>
        );
    }
}

export default classify(defaultClasses)(Footer);
