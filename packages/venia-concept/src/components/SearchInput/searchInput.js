import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';

import classify from 'src/classify';
import defaultClasses from './searchInput.css';

import Icon from 'src/components/Icon';

class SearchInput extends Component {
    static propTypes = {
      classes: PropTypes.shape({
        searchBlock: PropTypes.string,
        searchBlock_open: PropTypes.string
      }) 
    };

    constructor(props) {
      super(props);
      this.state = {
        searchInput : ''
      };
    }


    async componentDidMount() {
      if (this.props.isOpen) {        
        document.getElementById("searchInput").focus();
      }
    }

    componentDidUpdate(prevProps) {
      if (this.props.isOpen !== prevProps.isOpen && this.props.isOpen == true) {
        document.getElementById("searchInput").focus();
      }
    }

    render() {
      const { classes, isOpen } = this.props;

      const searchClass = isOpen ? classes.searchBlock_active: classes.searchBlock; 

      //Handle enter key to search!
      const enterSearch = (event) => {
          if (event.type === "click" || event.key === "Enter") {
            this.props.history.push(`/search?` + document.getElementById("searchInput").value);
          }
      };

      const minimizeSearch = () => {
          console.log("Blur");
          //some Action here
      };

      return (
          <div className={searchClass}>   
              <span 
                className={classes.searchIcon}
                onClick={enterSearch}
              >
                <Icon name="search" />
              </span>
              <input
                id="searchInput"
                className={classes.searchInput}
                inputMode="search"
                type="search"
                placeholder="I'm looking for..."
                onKeyPress={enterSearch}
                onBlur={minimizeSearch}
              />
          </div>
      );
    }
}

export default classify(defaultClasses)(withRouter(SearchInput));
