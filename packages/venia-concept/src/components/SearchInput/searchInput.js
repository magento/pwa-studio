import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { withRouter } from 'react-router';
import gql from 'graphql-tag';

import classify from 'src/classify';
import defaultClasses from './searchInput.css';

import Gallery from 'src/components/Gallery';

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

      const searchQuery = gql`
        query ($inputText: String) {
          products (search : $inputText) {
            items {
              id
              name
              small_image
              url_key
              price {
                regularPrice {
                  amount {
                    value
                    currency
                  }
                }
              }
            }
          }
        }
      `;

      const searchClass = isOpen ? classes.searchBlock_active: classes.searchBlock; 

      //Handle enter key to search!
      const handleKeyPress = (event) => {
          this.setState ({
              searchInput : event.target.value
            });
          if (event.key === "Enter") {
            this.props.history.push(`/search.html`)
            
          }
      };
      return (
          <div className={searchClass}>   
              <input
                id="searchInput"
                className={classes.searchInput}
                type="text"
                placeholder="I'm looking for..."
                onKeyPress={handleKeyPress}
              />
          </div>
      );
    }
}

export default classify(defaultClasses)(withRouter(SearchInput));
