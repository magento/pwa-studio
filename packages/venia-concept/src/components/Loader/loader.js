import React, { Component, createElement } from 'react';
import defaultClasses from './loader.css';
import classify from 'src/classify';
import { string, shape } from 'prop-types';
import logo from '../../components/Header/logo.svg';

class Loader extends Component {
  static propTypes = {
    classes: shape({
      root: string,
      title: string,
      logo: string,
    })
  };

  static defaultProps = {
    classes: defaultClasses
  };

  constructor() {
    super();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={ classes.flexCenter }>
        <img 
          className={ classes.loadingAnimation }
          alt="logo"
          src={logo}
          height="128px"
        />
        <p className={ classes.loadingAnimation }>loading...</p>
      </div>
    );
  }  
}

export default classify(defaultClasses)(Loader);
