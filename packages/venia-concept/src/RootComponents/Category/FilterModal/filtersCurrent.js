import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classify from 'src/classify';
import defaultClasses from './filtersCurrent.css';

class FiltersCurrent extends Component {
    removeOption = event => {
        const { title, value } = event.currentTarget || event.srcElement;
        const { group } =
            event.currentTarget.dataset || event.srcElement.dataset;
        const { updateChosenFilterOptions, chosenFilterOptions } = this.props;
        const filterGroup = chosenFilterOptions[group].chosenItems;

        const filteredOptions = filterGroup.filter(
            currentOption =>
                currentOption.title !== title && currentOption.value !== value
        );

        updateChosenFilterOptions({
            optionName: group,
            optionItems: filteredOptions
        });
    };

    render() {
        const { chosenFilterOptions, classes } = this.props;
        const { removeOption } = this;

        return (
            <ul className={classes.root}>
                {Object.keys(chosenFilterOptions).map(key =>
                    chosenFilterOptions[key].chosenItems.map(
                        ({ title, value }) => (
                            <li
                                className={classes.item}
                                key={`current-${title}-${value}`}
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
                        )
                    )
                )}
            </ul>
        );
    }
}

export default classify(defaultClasses)(FiltersCurrent);
