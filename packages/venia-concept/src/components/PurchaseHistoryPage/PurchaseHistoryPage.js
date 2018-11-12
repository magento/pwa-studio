import React, { Component } from 'react';
import Page from 'src/components/Page';
import PurchaseHistory from './PurchaseHistory';

export default class CMS extends Component {
    render() {
        return (
            <Page>
                <PurchaseHistory />
            </Page>
        );
    }
}
