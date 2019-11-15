import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Footer from '../Footer';
import Main from '../Main';
import Nav from '../Nav';
import './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <Nav />
            <Main />
            <Footer />
        </BrowserRouter>
    );
};

export default App;
