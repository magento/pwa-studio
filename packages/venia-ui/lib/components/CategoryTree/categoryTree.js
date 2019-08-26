import React, { useEffect } from 'react';
import { func, number, objectOf, shape, string } from 'prop-types';
import { useQuery } from '@magento/peregrine';

import { mergeClasses } from '../../classify';
import MENU_QUERY from '../../queries/getNavigationMenu.graphql';
import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.css';

const Tree = props => {
    const {
        categories,
        categoryId,
        onNavigate,
        setCategoryId,
        updateCategories
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const [queryResult, queryApi] = useQuery(MENU_QUERY);
    const { data } = queryResult;
    const { runQuery } = queryApi;

    // fetch categories
    useEffect(() => {
        if (categoryId != null) {
            runQuery({ variables: { id: categoryId } });
        }
    }, [categoryId, runQuery]);

    // update redux with fetched categories
    useEffect(() => {
        if (data && data.category) {
            updateCategories(data.category);
        }
    }, [data, updateCategories]);

    const rootCategory = categories[categoryId];
    const { children } = rootCategory || {};

    // for each child category, render a direct link if it has no children
    // otherwise render a branch
    const branches = Array.from((rootCategory && children) || [], id => {
        const category = categories[id];
        const isLeaf = category.children_count === '0';

        return isLeaf ? (
            <Leaf key={id} category={category} onNavigate={onNavigate} />
        ) : (
            <Branch
                key={id}
                category={category}
                setCategoryId={setCategoryId}
            />
        );
    });

    return (
        <div className={classes.root}>
            <ul className={classes.tree}>{branches}</ul>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categories: objectOf(
        shape({
            id: number.isRequired,
            name: string
        })
    ),
    categoryId: number.isRequired,
    classes: shape({
        root: string,
        tree: string
    }),
    onNavigate: func.isRequired,
    setCategoryId: func.isRequired,
    updateCategories: func.isRequired
};
