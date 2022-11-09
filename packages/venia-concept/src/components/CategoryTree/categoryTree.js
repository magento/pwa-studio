import React from 'react';
import { func, shape, string } from 'prop-types';
import { useCategoryTree } from '@magento/peregrine/lib/talons/CategoryTree';

import { useStyle } from '@magento/venia-ui/lib/classify';


import defaultClasses from '@magento/venia-ui/lib/components/CategoryTree/categoryTree.module.css';
import QuickOrder from '@orienteed/quickOrderForm/src/components/QuickOrder';
import Branch from '@magento/venia-ui/lib/components/CategoryTree/categoryBranch';
import Leaf from '@magento/venia-ui/lib/components/CategoryTree/categoryLeaf';

const Tree = props => {
    const { categoryId, onNavigate, setCategoryId, updateCategories } = props;

    const talonProps = useCategoryTree({
        categoryId,
        updateCategories
    });
    const { data, childCategories, categoryUrlSuffix } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    // for each child category, render a direct link if it has no children
    // otherwise render a branch
    const branches = data
        ? Array.from(childCategories, childCategory => {
              const [id, { category, isLeaf }] = childCategory;
              return isLeaf ? (
                  <Leaf
                      key={id}
                      category={category}
                      onNavigate={onNavigate}
                      categoryUrlSuffix={categoryUrlSuffix}
                  />
              ) : (
                  <Branch
                      key={id}
                      category={category}
                      setCategoryId={setCategoryId}
                  />
              );
          })
        : null;

    return (
        <div className={classes.root} data-cy="CategoryTree-root">
            <ul className={classes.tree}>
                <li className={classes.quickOrderMobile}>
                    <QuickOrder />
                </li>
                {branches}
            </ul>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categoryId: string,
    classes: shape({
        root: string,
        tree: string
    }),
    onNavigate: func.isRequired,
    setCategoryId: func.isRequired,
    updateCategories: func.isRequired
};
