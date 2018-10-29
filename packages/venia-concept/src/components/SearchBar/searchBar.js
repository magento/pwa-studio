import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

import Icon from 'src/components/Icon';

export class SearchBar extends Component {
    static propTypes = {
      classes: PropTypes.shape({
        searchBlock: PropTypes.string,
        searchBlockOpen: PropTypes.string
      }) 
    };

    constructor(props) {
      super(props);
      this.searchRef = React.createRef();
    }

    async componentDidMount() { 
      if (this.props.isOpen) {        
        this.searchRef.current.focus();
      }
      if (document.location.pathname === '/search') {
        const params = (new URL(document.location)).searchParams;
        this.searchRef.current.value = params.get("query");
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen) {
        if (this.props.isOpen == true) {
          this.searchRef.current.focus();
        }
        else {
          this.searchRef.current.blur();
        }
      }
    }

    enterSearch = (event) => {
        const searchQuery = this.searchRef.current.value;
        if ((event.type === "click" || event.key === "Enter") && searchQuery !== "") {
          this.props.history.push(`/search?query=` + searchQuery); 
        }
    };
    

    render() {
      const { classes, isOpen } = this.props;

      const searchClass = isOpen ? classes.searchBlockOpen: classes.searchBlock; 

      return (
          <div className={searchClass}>   
              <button
                className={classes.searchIcon}
                onClick={this.enterSearch}
              >
                <Icon name="search" />
              </button>
              <input
                ref={this.searchRef}
                className={classes.searchBar}
                inputMode="search"
                type="search"
                placeholder="I'm looking for..."
                onKeyPress={this.enterSearch}
              />
          </div>
      );
    }
}

export default classify(defaultClasses)(withRouter(SearchBar));
