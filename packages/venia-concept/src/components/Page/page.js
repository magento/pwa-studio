import { Component, createElement } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import PropTypes from 'prop-types';

import classify from 'src/classify';
import Main from 'src/components/Main';
import MiniCart from 'src/components/MiniCart';
import Navigation from 'src/components/Navigation';
import { selectAppState } from 'src/store/reducers/app';
import Mask from './mask';
import defaultClasses from './page.css';

class Page extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            masked: PropTypes.string,
            root: PropTypes.string
        })
    };

    render() {
        const { app, children, classes, closeDrawer } = this.props;
        const { drawer, overlay } = app;
        const navIsOpen = drawer === 'nav';
        const cartIsOpen = drawer === 'cart';
        const className = overlay ? classes.root_masked : classes.root;

        return (
            <div className={className}>
                <Main isMasked={overlay}>{children}</Main>
                <Mask isActive={overlay} dismiss={closeDrawer} />
                <Navigation isOpen={navIsOpen} />
                <MiniCart isOpen={cartIsOpen} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    closeDrawer: () => dispatch({ type: 'TOGGLE_DRAWER', payload: null })
});

export default compose(
    classify(defaultClasses),
    connect(
        selectAppState,
        mapDispatchToProps
    )
)(Page);
