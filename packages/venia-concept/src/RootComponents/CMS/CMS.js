import { createElement, Component } from 'react';

import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import Page from 'src/components/Page';
import CategoryList from 'src/components/CategoryList';

export default class CMS extends Component {
    render() {

        return (
            <Page>
                <CategoryList title={'Shop by category'} id={2}></CategoryList>
            </Page>
        );
    }
}
