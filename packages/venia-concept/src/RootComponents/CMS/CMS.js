import React, { Component } from 'react';
import Page from 'src/components/Page';
import CategoryList from 'src/components/CategoryList';

export default class CMS extends Component {
    render() {
        return (
            <Page>
                <CategoryList title="Shop by category" id={2} />
            </Page>
        );
    }
}
