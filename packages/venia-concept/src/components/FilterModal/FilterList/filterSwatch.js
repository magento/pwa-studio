import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Icon from 'src/components/Icon';
import Checkmark from 'react-feather/dist/icons/check';
import classify from 'src/classify';
import defaultClasses from './filterSwatch.css';

const cache = new Map();

const memoize = fn => key =>
    cache.has(key) ? cache.get(key) : cache.set(key, fn(key)).get(key);

const getRandomColor = () =>
    Array.from({ length: 3 }, () => Math.floor(Math.random() * 255)).join(',');

const memoizedGetRandomColor = memoize(getRandomColor);

class FilterSwatch extends Component {
    static propTypes = {
        classes: PropTypes.shape({
            root: PropTypes.string,
            swatchLabel: PropTypes.string,
            iconWrapper: PropTypes.string,
            swatch: PropTypes.string
        }),
        options: PropTypes.shape({
            generateColor: PropTypes.bool
        }),
        isActive: PropTypes.bool,
        toggleOption: PropTypes.func,
        value_string: PropTypes.string,
        label: PropTypes.string,
        group: PropTypes.string
    };

    render() {
        const {
            options,
            isActive,
            toggleOption,
            value_string,
            label,
            classes,
            group
        } = this.props;

        const generatedColor =
            options.generateColor && memoizedGetRandomColor(value_string);

        const swatchInlineStyle = generatedColor && {
            backgroundColor: `rgb(${generatedColor})`
        };

        return (
            <button
                className={classes.root}
                value={value_string}
                data-group={group}
                title={label}
                onClick={toggleOption}
            >
                {isActive && (
                    <Fragment>
                        <span
                            className={classes.swatchLabel}
                            dangerouslySetInnerHTML={{
                                __html: label
                            }}
                        />
                        <span className={classes.iconWrapper}>
                            <Icon src={Checkmark} size={36} />
                        </span>
                    </Fragment>
                )}
                {options.generateColor && (
                    <span
                        className={classes.swatch}
                        style={swatchInlineStyle}
                    />
                )}
            </button>
        );
    }
}

export default classify(defaultClasses)(FilterSwatch);
