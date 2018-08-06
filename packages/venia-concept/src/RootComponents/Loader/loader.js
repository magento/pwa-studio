import React, { Component, createElement } from 'react';
import defaultClasses from './loader.css';
import classify from 'src/classify';
import { string, shape } from 'prop-types';


class Loader extends Component {
  static propTypes = {
    classes: shape({
      root: string,
      title: string
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
      <h1 className={ classes.loader }> HEY </h1>
    );
  }  
}

export default classify(defaultClasses)(Loader);
