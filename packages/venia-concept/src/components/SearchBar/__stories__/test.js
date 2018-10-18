import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';  // Can I use action here?
import SearchBar from '../';

const stories = storiesOf('SearchBar', module);

stories.add('Default', () => (
  <Router>
    <SearchBar
      isOpen={true}
    />
  </Router>
  ));
