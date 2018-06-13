import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import app from 'src';
import classify from 'src/classify';
import Product from 'src/RootComponents/Product';
import Page from 'src/components/Page';
import { selectNavigation } from 'src/store/reducers/navigation';
import getNamedExport from 'src/util/getNamedExport';
import defaultClasses from './app.css';

export class App extends Component {
    static propTypes = {
        navigation: PropTypes.shape({
            open: PropTypes.bool
        })
    };

    componentDidMount() {
        getNamedExport(import('src/store/reducers/navigation'))
            .then(reducer => {
                app.addReducer('navigation', reducer);
            })
            .catch(error => {
                throw error;
            });
    }

    render() {
        const { navigation } = this.props;
        const nav = navigation.open || null;

        return (
            <Page nav={nav}>
                <Product />
            </Page>
        );
    }
}

const mapStateToProps = state => ({
    navigation: selectNavigation(state)
});

export default compose(
    classify(defaultClasses),
    connect(mapStateToProps)
)(App);
