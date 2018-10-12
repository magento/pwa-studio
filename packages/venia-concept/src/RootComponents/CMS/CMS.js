import React, { Component } from 'react';
import { number, shape, string } from 'prop-types';
import Page from 'src/components/Page';
import { Query } from 'react-apollo';
import classify from 'src/classify';
import defaultClasses from './cmsPage.css';
import CategoryList from 'src/components/CategoryList';
import getCmsPage from '../..//queries/getCmsPage.graphql';

class CmsPage extends Component {
    static propTypes = {
        id: number,
        classes: shape({
            gallery: string,
            root: string,
            title: string,
            layout_1column: string,
            layout_default: string
        })
    };
    render() {
        const { id, classes } = this.props;
        return (
            <Page>
                <Query query={getCmsPage} variables={{ id, onServer: false }}>
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        const {
                            title,
                            content_heading,
                            content,
                            page_layout
                        } = data.cmsPage;
                        const layoutClass =
                            classes[`layout_${page_layout || 'default'}`];
                        return (
                            <article className={classes.root}>
                                <h1 className={classes.title}>
                                    {content_heading || title}
                                </h1>
                                <section
                                    className={layoutClass}
                                    dangerouslySetInnerHTML={{
                                        __html: content
                                    }}
                                />
                            </article>
                        );
                    }}
                </Query>
                <CategoryList title="Shop by category" id={2} />
            </Page>
        );
    }
}

export default classify(defaultClasses)(CmsPage);
