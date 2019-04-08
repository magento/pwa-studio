import React, { Component } from 'react';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import defaultClasses from './footer.css';
import storeConfigDataQuery from '../../queries/getStoreConfigData.graphql';
import { Query } from 'src/drivers';

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
                <div className={classes.tile}>
                    <h2 className={classes.tileTitle}>
                        <span>Your Account</span>
                    </h2>
                    <p className={classes.tileBody}>
                        <span>
                            Sign up and get access to our wonderful rewards
                            program.
                        </span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2 className={classes.tileTitle}>
                        <span>inquiries@example.com</span>
                    </h2>
                    <p className={classes.tileBody}>
                        <span>
                            Need to email us? Use the address above and
                            we&rsquo;ll respond as soon as possible.
                        </span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2 className={classes.tileTitle}>
                        <span>Live Chat</span>
                    </h2>
                    <p className={classes.tileBody}>
                        <span>Mon – Fri: 5 a.m. – 10 p.m. PST</span>
                        <br />
                        <span>Sat – Sun: 6 a.m. – 9 p.m. PST</span>
                    </p>
                </div>
                <div className={classes.tile}>
                    <h2 className={classes.tileTitle}>
                        <span>Help Center</span>
                    </h2>
                    <p className={classes.tileBody}>
                        <span>Get answers from our community online.</span>
                    </p>
                </div>
                <small className={classes.copyright}>
                    <Query query={storeConfigDataQuery}>
                        {({ loading, error, data }) => {
                            if (error) {
                                return (
                                    <span className={classes.fetchError}>
                                        Data Fetch Error:{' '}
                                        <pre>{error.message}</pre>
                                    </span>
                                );
                            }
                            if (loading) {
                                return (
                                    <span className={classes.fetchingData}>
                                        Fetching Data
                                    </span>
                                );
                            }

                            return <span>{data.storeConfig.copyright}</span>;
                        }}
                    </Query>
                </small>
            </footer>
        );
    }
}

export default classify(defaultClasses)(Footer);
