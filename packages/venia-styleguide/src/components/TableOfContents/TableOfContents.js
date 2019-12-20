import React from 'react';
import Link from '../Link';

import { useArticleContext } from '../Article';
import classes from './TableOfContents.css';

const MAGIC_ID = 'TABLE-OF-CONTENTS';

const TableOfContents = () => {
    const [sections] = useArticleContext();

    const elements = Array.from(sections, section => {
        const [title, id] = section;
        const fragment = `#${id}`;

        // avoid linking to this section itself
        if (id.toUpperCase() === MAGIC_ID) {
            return null;
        }

        return (
            <li key={title} className={classes.entry}>
                <Link className={classes.link} to={fragment}>
                    {title}
                </Link>
            </li>
        );
    });

    return <ul className={classes.root}>{elements}</ul>;
};

export default TableOfContents;
