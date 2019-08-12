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
        if (categoryId) {
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
    const { children, url_path } = rootCategory || {};

    // render a branch for each child category
    const branches = rootCategory
        ? Array.from(children || [], id => (
              <Branch
                  key={id}
                  category={categories[id]}
                  setCategoryId={setCategoryId}
              />
          ))
        : null;

    const leaf =
        rootCategory && url_path ? (
            <Leaf category={rootCategory} onNavigate={onNavigate} />
        ) : null;

    return (
        <div className={classes.root}>
            <ul className={classes.tree}>
                {branches}
                {leaf}
            </ul>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categories: objectOf(
        shape({
            id: number.isRequired,
            name: string,
            url_path: string
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
