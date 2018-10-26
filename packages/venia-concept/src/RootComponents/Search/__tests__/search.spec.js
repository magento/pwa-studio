import React from 'react';
import { configure, shallow, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Search } from '../search';

configure({ adapter: new Adapter() });

test("Return results on valid search", async () => {
  //let wrapper = shallow(  
  // <Search />
  // );
});

test("Return 'No Results Found' on valid input with no results", async () => {

});
