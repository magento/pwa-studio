import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import classify from 'src/classify';
import defaultClasses from './cmsBlock.css';

const cmsBlockQuery = gql`
    query cmsBlocks($identifiers: [String]!) {
        cmsBlocks(identifiers: $identifiers) {
            items {
                content
            }
        }
    }
`;

class CmsBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            content: PropTypes.string
        }),
        identifiers: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
    };

    render() {
        const { identifiers, classes } = this.props;
        return (
            <div className={classes.root}>
                <Query query={cmsBlockQuery} variables={{ identifiers }}>
                    {({ loading, error, data }) => {
                        if (error) return <div>Data Fetch Error</div>;
                        if (loading) return <div>Fetching Data</div>;
                        if (data.cmsBlocks.items == '')
                            return <div>Here is not any block(s)</div>;

                        return (
                            <div className={classes.content}>
                                {data.cmsBlocks.items.map((item, index) => (
                                    <div
                                        key={index}
                                        dangerouslySetInnerHTML={{
                                            __html: item.content
                                        }}
                                    />
                                ))}
                            </div>
                        );
                    }}
                </Query>
            </div>
        );
    }
}

export default classify(defaultClasses)(CmsBlock);
