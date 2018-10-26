import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
//import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '../header';
//import toggleSearch from '../../../actions/app';
//import app from '../../../reducers/app';

configure({ adapter: new Adapter() });

const classes = {
  open: 'open',
  closed: 'closed',
  searchTriggerOpen: 'triggerOpen',
  searchTrigger: 'triggerClosed'
}

//test('Header should render properly', async () => {

//});

test('When icon is clicked, toggle function is ran', async () => { 
  const searchOpen = false;
  const toggleSearch = jest.fn();
  const app = { searchOpen };
  let wrapper = shallow( 
      <Header 
        app={app}
        classes={classes} 
        toggleSearch={toggleSearch}
      />
      );  
  const searchButton = wrapper.find('#searchButton');
  wrapper.instance().forceUpdate();
  searchButton.simulate("click");
  expect(toggleSearch.mock.calls).toEqual([[]]); // Has been called
});

