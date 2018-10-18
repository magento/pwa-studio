import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';

import classify from 'src/classify';
import defaultClasses from './searchBar.css';

import Icon from 'src/components/Icon';

class SearchBar extends Component {
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
        document.getElementById("searchInput").value = document.location.search.substring(1);
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

    render() {
      const { classes, isOpen, toggleSearch } = this.props;

      const searchClass = isOpen ? classes.searchBlockOpen: classes.searchBlock; 

      const enterSearch = (event) => {
          if (event.type === "click" || event.key === "Enter") {
            this.props.history.push(`/search?` + document.getElementById("searchInput").value);
          }
      };

      return (
          <div className={searchClass}>   
              <button
                className={classes.searchIcon}
                onClick={enterSearch}
              >
                <Icon name="search" />
              </button>
              <input
                id="searchInput"
                className={classes.searchBar}
                inputMode="search"
                type="search"
                placeholder="I'm looking for..."
                onKeyPress={enterSearch}
              />
          </div>
      );
    }
}

export default classify(defaultClasses)(withRouter(SearchBar));
