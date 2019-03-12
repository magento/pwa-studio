import React, { Component, Fragment } from 'react';
import CategoryList from 'src/components/CategoryList';
import HomePage from 'src/components/HomePage';

export default class CMS extends Component {
    render() {
        return (
            <Fragment>
                <HomePage id={2}/>
                <CategoryList title="Shop by category" id={2} />
            </Fragment>
        );
    }
}
