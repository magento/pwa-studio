import { createElement, Component } from 'react';
import Page from 'src/components/Page';
import CategoryList from 'src/components/CategoryList';
import Login from 'src/components/Login';

export default class CMS extends Component {
    render() {
        return (
            <Page>
                <Login />
                <CategoryList title="Shop by category" id={2} />
            </Page>
        );
    }
}
