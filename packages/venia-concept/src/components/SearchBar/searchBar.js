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

    async componentDidMount() { 
      if (this.props.isOpen) {        
        document.getElementById("searchInput").focus();
      }
      if (document.location.pathname === '/search') {
        const params = (new URL(document.location)).searchParams;
        document.getElementById("searchInput").value = params.get("query");
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen) {
        if (this.props.isOpen == true) {
          document.getElementById("searchInput").focus();
        }
        else {
          document.getElementById("searchInput").blur();
        }
      }
    }

    enterSearch = (event) => {
        const searchInput = document.getElementById("searchInput").value;
        if ((event.type === "click" || event.key === "Enter") && searchInput !== "") {
          this.props.history.push(`/search?query=` + searchInput); 
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
                id="searchInput"
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
