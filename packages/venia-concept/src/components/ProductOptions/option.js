import { Component, createElement } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './option.css';

class Option extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            children: PropTypes.string,
            childrenContainer: PropTypes.string
        }),
        item: PropTypes.shape({
            backgroundColor: PropTypes.string,
            name: PropTypes.string,
            text: PropTypes.string,
            opts: PropTypes.object,
            isSelected: PropTypes.bool
        })
    };

    get check() {
      const { item } = this.props;
      const { isSelected  } = item;

      return isSelected ? (
        <Icon name="check" />
      ) : null
    }

    render() {
        const { classes, item, children } = this.props;
        const { check } =  this;
        const { backgroundColor, name, isSelected, opts } = item;
        const style = { '--background-color': backgroundColor };

        const buttonClasses = isSelected ? `${classes.root} ${classes.selected}` : classes.root;

        return (
			<button
				className={buttonClasses}
				title={name}
				style={style}
				onClick={this.handleClick}
				{...opts}
            >
          <span className={classes.childrenContainer}>
              <span className={classes.children}> {children} </span>
              <span className={classes.check}> {check} </span>
          </span>
          <div className={classes.overlay} />
        </button>
        );
    }

    handleClick = () => {
        this.props.handleClick(this.props.item);
    };
}

export default classify(defaultClasses)(Option);
