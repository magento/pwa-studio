import { Component, createElement } from 'react';
import { connect } from 'react-redux';

import Footer from 'src/view/Footer';
import Header from 'src/view/Header';
import Main from 'src/view/Main';
import Navigation from 'src/view/Navigation';

import './app.css';

class App extends Component {
    render() {
        const nav = !!this.props.navigation.open || null;

        return (
            <div className="App" data-nav={nav}>
                <Header nav={nav} />
                <Main />
                <Footer />
                <Navigation nav={nav} />
            </div>
        );
    }
}

const mapStateToProps = ({ views }) => ({ navigation: views.navigation });

export default connect(mapStateToProps)(App);

export { App };
