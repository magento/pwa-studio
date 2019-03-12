import React, { Component, Fragment } from 'react';
import CategoryList from 'src/components/CategoryList';
import CmsPage from 'src/components/CmsPage';

export default class CMS extends Component {
    render() {
        return (
            <Fragment>
                <CmsPage id={2} />
                <CategoryList title="Shop by category" id={2} />
            </Fragment>
        );
    }
}
