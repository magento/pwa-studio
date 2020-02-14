import React from 'react';
import { render } from 'react-dom';

import App from './components/App';
import './styles';

const element = <App />;
const container = document.getElementById('root');

render(element, container);
