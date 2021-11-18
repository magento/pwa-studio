import React from 'react';
import { shape, string } from 'prop-types';
import { useStyle } from '../../classify';
import Shimmer from '../Shimmer';
import defaultClasses from './contactPage.module.css';
import shimmerClasses from './contactPage.shimmer.module.css';

const ContactPageShimmer = props => {
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, shimmerClasses, propClasses);

    return (
        <article className={classes.root} data-cy="ContactPage-root">
            <div className={classes.banner}>
                <Shimmer classes={{ root_rectangle: classes.shimmerBanner }} />
            </div>
            <div className={classes.content}>
                <div className={classes.formContainer}>
                    <div className={classes.title}>
                        <Shimmer classes={{ root_rectangle: classes.shimmer }}>
                            &nbsp;
                        </Shimmer>
                    </div>

                    <div className={classes.subtitle}>
                        <Shimmer classes={{ root_rectangle: classes.shimmer }}>
                            &nbsp;
                        </Shimmer>
                    </div>
                    <div className={classes.form}>
                        <div key="name">
                            <Shimmer
                                classes={{
                                    root_rectangle: classes.shimmerLabel
                                }}
                            >
                                &nbsp;
                            </Shimmer>
                            <Shimmer type="textInput" />
                        </div>
                        <div key="email">
                            <Shimmer
                                classes={{
                                    root_rectangle: classes.shimmerLabel
                                }}
                            >
                                &nbsp;
                            </Shimmer>
                            <Shimmer type="textInput" />
                        </div>
                        <div key="telephone">
                            <Shimmer
                                classes={{
                                    root_rectangle: classes.shimmerLabel
                                }}
                            >
                                &nbsp;
                            </Shimmer>
                            <Shimmer type="textInput" />
                        </div>
                        <div key="comment">
                            <Shimmer
                                classes={{
                                    root_rectangle: classes.shimmerLabel
                                }}
                            >
                                &nbsp;
                            </Shimmer>
                            <Shimmer type="textArea" />
                        </div>
                        <div className={classes.buttonsContainer}>
                            <Shimmer type="button" />
                        </div>
                    </div>
                </div>
                <div className={classes.sideContent}>
                    <Shimmer
                        classes={{ root_rectangle: classes.shimmerSideContent }}
                    />
                </div>
            </div>
        </article>
    );
};

ContactPageShimmer.propTypes = {
    classes: shape({
        root: string,
        banner: string,
        content: string,
        formContainer: string,
        title: string,
        subtitle: string,
        form: string,
        buttonsContainer: string,
        sideContent: string,
        shimmer: string,
        shimmerBanner: string,
        shimmerLabel: string,
        shimmerSideContent: string
    })
};

export default ContactPageShimmer;
