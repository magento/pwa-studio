import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import FilterList from './FilterList';
import Icon from 'src/components/Icon';
import ArrowDown from 'react-feather/dist/icons/chevron-down';
import ArrowUp from 'react-feather/dist/icons/chevron-up';
import defaultClasses from './filterBlock.css';

class FilterBlock extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string
        }),
        item: PropTypes.shape({
            name: PropTypes.array,
            filter_items: PropTypes.array,
            request_var: PropTypes.string
        }),
        filterAdd: PropTypes.func,
        filterRemove: PropTypes.func
    };

    state = {
        isExpanded: false
    };

    optionToggle = () => {
        const { isExpanded } = this.state;
        this.setState({ isExpanded: !isExpanded });
    };

    getControlBlock = isExpanded => {
        const { classes, item } = this.props;
        const iconSrc = isExpanded ? ArrowUp : ArrowDown;
        const nameClass = isExpanded
            ? classes.optionNameExpanded
            : classes.optionName;

        return (
            <div className={classes.optionHeader}>
                <button
                    onClick={this.optionToggle}
                    className={classes.optionToggleButton}
                >
                    <span className={nameClass}>{item.name}</span>
                    <span className={classes.closeWrapper}>
                        <Icon src={iconSrc} />
                    </span>
                </button>
            </div>
        );
    };

    render() {
        const {
            classes,
            item: { filter_items, request_var },
            filterRemove,
            filterAdd
        } = this.props;

        const { isExpanded } = this.state;

        const listClassName = isExpanded
            ? classes.filterListExpanded
            : classes.filterList;

        const controlBlock = this.getControlBlock(isExpanded);

        return (
            <li className={classes.root}>
                {controlBlock}
                <div className={listClassName}>
                    <FilterList
                        filterAdd={filterAdd}
                        filterRemove={filterRemove}
                        id={request_var}
                        items={filter_items}
                    />
                </div>
            </li>
        );
    }
}

export default classify(defaultClasses)(FilterBlock);
