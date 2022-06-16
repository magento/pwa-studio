import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './options.module.css';

const Options = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { simpleProductAggregationFiltered } = props;

    return (
        <main className={classes.optionsContainer}>
            <header className={classes.labelContainer}>
                <h3>Attributes</h3>
            </header>
            <section className={classes.tilesContainer}>
                {simpleProductAggregationFiltered.map(aggregation => {
                    return (
                        <article key={aggregation.label}>
                            {aggregation.options.map(option => {
                                return (
                                    <article key={option.label} className={classes.optionContainer}>
                                        <p>{option.label}</p>
                                    </article>
                                );
                            })}
                        </article>
                    );
                })}
            </section>
        </main>
    );
};

export default Options;
