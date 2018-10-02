import { Component, createElement } from 'react';

import { Query } from 'react-apollo';
import Page from  'src/components/Page';
import Gallery from 'src/components/Gallery';
import gql from 'graphql-tag';
import classify from 'src/classify';
import defaultClasses from './search.css';

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

class Search extends Component {
 
  render() {    

    return(
      <Page>
        <Query query={searchQuery} variables={{ "inputText" : this.state.searchInput }}> 
          {({ loading, error, data }) => {
            if (loading) return "Loading";
            if (error) return `Error ${error.message}`;

            return (
              <div>
                <Gallery
                  data={data.products.items}
                />
                {data.products.items.map(item => (
                  <span>
                    {item.name}
                  </span>
                ))}
              </div>
            );
          }}
        </Query>
      </Page>
    );
  }
}

export default classify(defaultClasses)(Search);
