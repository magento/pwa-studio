import React from 'react';
import { Link } from 'react-router-dom';

import { useArticleContext } from '../Article';

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
            <li key={title}>
                <Link to={fragment}>{title}</Link>
            </li>
        );
    });

    return <ul>{elements}</ul>;
};

export default TableOfContents;
