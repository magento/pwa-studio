import { Component, createElement } from 'react';

import Footer from 'src/view/Footer';
import Header from 'src/view/Header';
import Main from 'src/view/Main';
import Navigation from 'src/view/Navigation';

import './page.css';

class Page extends Component {
    render() {
        const { children, nav } = this.props;

        return (
            <div className="Page" data-nav={nav}>
                <Header nav={nav} />
                <Main>{children}</Main>
                <Footer />
                <Navigation nav={nav} />
            </div>
        );
    }
}

export default Page;
