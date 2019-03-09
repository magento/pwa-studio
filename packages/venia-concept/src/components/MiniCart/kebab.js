import React, { Component, createRef } from 'react';
import { shape, string } from 'prop-types';
import Icon from 'src/components/Icon';
import classify from 'src/classify';
import defaultClasses from './kebab.css';

import MoreVerticalIcon from 'react-feather/dist/icons/more-vertical';

class Kebab extends Component {
    static propTypes = {
        classes: shape({
            dropdown: string,
            dropdown_active: string,
            kebab: string,
            root: string
        })
    };

    constructor(props) {
        super(props);
        this.kebabButtonRef = createRef();

        this.state = {
            isOpen: false
        };
    }

    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
        document.addEventListener('touchend', this.handleDocumentClick);
    }

    handleDocumentClick = event => {
        this.kebabButtonRef.current.contains(event.target)
            ? this.setState({ isOpen: true })
            : this.setState({ isOpen: false });
    };

    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('touchend', this.handleDocumentClick);
    }

    render() {
        const { classes, children, ...restProps } = this.props;

        const toggleClass = this.state.isOpen
            ? classes.dropdown_active
            : classes.dropdown;

        return (
            <div {...restProps} className={classes.root}>
                <button className={classes.kebab} ref={this.kebabButtonRef}>
                    <Icon src={MoreVerticalIcon} />
                </button>
                <ul className={toggleClass}>{children}</ul>
            </div>
        );
    }
}

export default classify(defaultClasses)(Kebab);
