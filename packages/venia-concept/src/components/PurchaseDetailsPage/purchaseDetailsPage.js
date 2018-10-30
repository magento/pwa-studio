import React, { Component } from 'react';
import Page from 'src/components/Page';
import PurchaseDetails from './PurchaseDetails';

export default class PurchaseDetailsPage extends Component {
    render() {
        return (
            <Page>
                <PurchaseDetails />
            </Page>
        );
    }
}
