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

    // For each child category, render a direct link if it has no children,
    // otherwise render a branch.
    const branches = rootCategory
        ? Array.from(children || [], id => {
              if (categories[id].children_count === '0') {
                  return (
                      <Leaf
                          key={id}
                          category={categories[id]}
                          onNavigate={onNavigate}
                      />
                  );
              } else {
                  return (
                      <Branch
                          key={id}
                          category={categories[id]}
                          setCategoryId={setCategoryId}
                      />
                  );
              }
          })
        : null;

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
