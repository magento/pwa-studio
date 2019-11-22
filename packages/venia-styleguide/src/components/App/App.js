import React from 'react';
import { BrowserRouter } from 'react-router-dom';

import Footer from '../Footer';
import Main from '../Main';
import Navigation from '../Navigation';
import Routes from '../Routes';
import classes from './App.css';

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <div className={classes.root}>
                    <Navigation />
                    <Main />
                    <Footer />
                </div>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
