import React from 'react';
import { configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { SearchBar } from '../searchBar';

configure({ adapter: new Adapter() });

const classes = {
  searchBlockOpen: 'open',
  searchBlock: 'closed'
};

//test('SearchBar should Render correctly', async () => {
  //const wrapper = renderer.create(
    //<SearchBar classes={classes} isOpen={true} />
    //    ).toJSON();
  //expect(wrapper).toMatchInlineSnapshot();
  //});

//test('Input is focused when isOpen is true', async () => {
  //let wrapper = mount(
    //<SearchBar classes={classes} isOpen={true} />
    //);
  //const searchInput = wrapper.find('#searchInput').instance();
  //spyOn(searchInput, 'focus');
  //wrapper.instance().forceUpdate();
  //wrapper.instance().componentDidMount();
  //expect(searchInput.focus).toHaveBeenCalled();
//});

test('enter key to submit while expanded', async () => {
  //Need to mock componentDidMount to avoid calling focus()
  const didMount = jest.spyOn(SearchBar.prototype, 'componentDidMount').mockImplementation( () => {
  });
  let wrapper = mount(
    <SearchBar classes={classes} isOpen={true} />
    );    
  const searchInput = wrapper.find('#searchInput');  
  const spy = jest.spyOn(wrapper.instance(), 'enterSearch').mockImplementation((event) => {
    if ((event.type === "click" || event.key === "Enter") && searchInput.instance().value !== ""){
      return true;
    } else {
      return false;
    }
  });
  wrapper.instance().forceUpdate();
  searchInput.instance().value = "a";
  searchInput.simulate("change");
  searchInput.simulate("keyPress", {key: "Enter"}); 
  expect(spy).toHaveReturnedWith(true);
});

test('search icon to submit when clicked', async () => {
  let wrapper = mount(
    <SearchBar classes={classes} isOpen={true} />
    );       
  const searchInput = wrapper.find('#searchInput');
  const searchButton = wrapper.find('button');
  const spy = jest.spyOn(wrapper.instance(), 'enterSearch').mockImplementation((event) => { 
    if ((event.type === "click" || event.key === "Enter") && searchInput.instance().value !== ""){
      return true;
    } else {
      return false;
    }
  });
  wrapper.instance().forceUpdate();
  searchInput.instance().value ="a";
  searchInput.simulate("change");
  searchButton.simulate("click");
  expect(spy).toHaveReturnedWith(true);
});

test('search can not submit when search input empty', async () => {
  let wrapper = mount(
    <SearchBar classes={classes} isOpen={true} />
  );    
  const searchInput = wrapper.find('#searchInput');
  const spy = jest.spyOn(wrapper.instance(), 'enterSearch').mockImplementation((event) => {
    if ((event.type === "click" || event.key === "Enter") && searchInput.instance().value !== ""){
      return true;
    } else {
      return false;
    }
  });
  wrapper.instance().forceUpdate(); 
  searchInput.simulate("change");
  searchInput.simulate("keyPress", {key: "Enter"}); 
  expect(spy).toHaveReturnedWith(false);
});

//Query results/text input maintained on refresh (should test in RootComponent!)

