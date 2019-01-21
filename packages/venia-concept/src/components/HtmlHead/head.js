import React, { Component } from 'react';
import Helmet from 'react-helmet';

import { Query } from 'react-apollo';
import STORE_HEAD_CONFIG from '../../queries/getStoreHeadConfig.graphql';

import { shape, string } from 'prop-types';

class HtmlHead extends Component {
    static propTypes = {
        data: shape({
            storeConfig: shape({
                default_title: string,
                title_prefix: string,
                title_suffix: string,
                default_keywords: string,
                default_description: string
            }).isRequired
        })
    };

    render () {
        let { title, meta_title, meta_keywords, meta_description } = this.props;

        return (
            <Query query={STORE_HEAD_CONFIG}>
                {({ loading, error, data }) => {
                    if (error) return <div>Data Fetch Error</div>;

                    if (!data.storeConfig) {
                        return '';
                    }

                    const titlePrefix = data.storeConfig.title_prefix;
                    const titleSuffix = data.storeConfig.title_suffix;
                    const defaultTitle = data.storeConfig.default_title;

                    // Setting up the title
                    if (!title) {
                        title = defaultTitle;
                    }

                    if (titlePrefix) {
                        title = titlePrefix + title;
                    }

                    if (titleSuffix) {
                        title = title + titleSuffix;
                    }

                    // Setting up the meta title
                    if (!meta_title) {
                        meta_title = title;
                    }

                    // Setting up the meta keywords
                    if (!meta_keywords) {
                        meta_keywords = data.storeConfig.default_keywords;
                    }

                    // Setting up the meta description
                    if (!meta_description) {
                        meta_description = data.storeConfig.default_description;
                    }

                    return (
                        <Helmet>
                            <title>{title}</title>
                            <meta name="title" content={meta_title} />
                            {meta_keywords && (
                                <meta name="keywords" content={meta_keywords} />
                            )}
                            {meta_description && (
                                <meta name="description" content={meta_description} />
                            )}
                        </Helmet>
                    );
                }}
            </Query>
        );
    }
}

export default HtmlHead;
