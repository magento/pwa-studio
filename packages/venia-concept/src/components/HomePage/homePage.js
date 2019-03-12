import React, { Component } from 'react';
import { Query } from 'src/drivers';
import { number, shape, string } from 'prop-types';
import { loadingIndicator } from 'src/components/LoadingIndicator';
import classify from 'src/classify';
import defaultClasses from './homePage.css';
import ReactHtmlParser from 'react-html-parser';
import cmsPageQuery from '../../queries/getCmsPage.graphql';

class HomePage extends Component {
    static propTypes = {
        classes: shape({
            root: string,
            content: string
        }),
        id: number.isRequired
    };

    render() {
        const { id, classes } = this.props;

        return (
            <Query query={cmsPageQuery} variables={{ id: id, onServer: false }}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;
                    if (loading) return loadingIndicator;

                    const { cmsPage } = data;
                    const { content, content_heading } = cmsPage || {};

                    return (
                        <div className={classes.root}>
                            <h1 className="title">{content_heading}</h1>
                            <div className={classes.content}>
                                {ReactHtmlParser(content)}
                            </div>
                        </div>
                    );
                }}
            </Query>
        );
    }
}

export default classify(defaultClasses)(HomePage);
