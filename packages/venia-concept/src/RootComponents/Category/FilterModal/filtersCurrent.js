import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
        const { chosenFilterOptions, classes, id } = this.props;
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
                                dangerouslySetInnerHTML={{
                                    __html: title
                                }}
                            />
                        </li>
                    ))
                )}
            </ul>
        );
    }
}

export default classify(defaultClasses)(FiltersCurrent);
