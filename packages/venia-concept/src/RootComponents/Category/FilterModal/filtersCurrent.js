import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Remove from 'react-feather/dist/icons/x';
import classify from 'src/classify';
import defaultClasses from './filtersCurrent.css';

class FiltersCurrent extends Component {
    removeOption = event => {
        const { title, value, dataset } =
            event.currentTarget || event.srcElement;
        const { group } = dataset;
        const { filterRemove } = this.props;
        filterRemove({ title, value, group });
    };

    render() {
        const { chosenFilterOptions, classes, keyPrefix } = this.props;
        const { removeOption } = this;

        return (
            <ul className={classes.root}>
                {Object.keys(chosenFilterOptions).map(key =>
                    chosenFilterOptions[key].map(({ title, value }) => (
                        <li
                            className={classes.item}
                            key={`${keyPrefix}-${title}-${value}`}
                        >
                            <button
                                className={classes.button}
                                onClick={removeOption}
                                data-group={key}
                                title={title}
                                value={value}
                            >
                                <Icon
                                    className={classes.icon}
                                    src={Remove}
                                    size={16}
                                />
                                <span
                                    dangerouslySetInnerHTML={{
                                        __html: title
                                    }}
                                />
                            </button>
                        </li>
                    ))
                )}
            </ul>
        );
    }
}

export default classify(defaultClasses)(FiltersCurrent);
