import React, { useCallback, useMemo, useState } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';

import { mergeClasses } from '../../classify';
import Icon from '../Icon';
import FilterList from './FilterList';
import { filterModes, filterRenderOptions, filterLayouts } from './constants';
import defaultClasses from './filterBlock.css';

const getFilterType = id => (id === 'fashion_color' ? 'SWATCH' : 'DEFAULT');

const FilterBlock = props => {
    const { filterApi, filterState, item } = props;
    const { filter_items: items, name, request_var: id } = item;
    const filterType = getFilterType(id);
    const isSwatch = filterType === 'SWATCH';

    return (
        <li>
            <FilterList
                filterApi={filterApi}
                filterState={filterState}
                id={id}
                isSwatch={isSwatch}
                items={items}
            />
        </li>
    );
};

// const FilterBlock = props => {
//     const {
//         item: { filter_items, request_var, name }
//     } = props;

//     const [isExpanded, setIsExpanded] = useState(false);

//     const toggleOption = useCallback(() => {
//         setIsExpanded(!isExpanded);
//     }, [isExpanded]);

//     const { mode, options } = useMemo(
//         () =>
//             filterRenderOptions[`${request_var}`] ||
//             filterRenderOptions[filterModes.default],
//         [request_var]
//     );

//     // Create classNames
//     const classes = mergeClasses(defaultClasses, props.classes);
//     const listClassName = isExpanded
//         ? classes.filterListExpanded
//         : classes.filterList;

//     let layoutClass;
//     switch (options.layout) {
//         case filterLayouts.grid:
//             layoutClass = classes.layoutGrid;
//         default:
//             layoutClass = classes.layout;
//     }

//     const nameClass = isExpanded
//         ? classes.optionNameExpanded
//         : classes.optionName;

//     // Create some props to pass to the FilterList component
//     const filterListProps = {
//         isSwatch: filterModes[mode] === filterModes.swatch,
//         options,
//         name,
//         mode,
//         id: request_var,
//         items: filter_items,
//         layoutClass
//     };

//     // Render the things.
//     const iconSrc = isExpanded ? ArrowUp : ArrowDown;
//     return (
//         <li className={classes.root}>
//             <div className={classes.optionHeader}>
//                 <button
//                     onClick={toggleOption}
//                     className={classes.optionToggleButton}
//                 >
//                     <span className={nameClass}>{name}</span>
//                     <span className={classes.closeWrapper}>
//                         <Icon src={iconSrc} />
//                     </span>
//                 </button>
//             </div>
//             <div className={listClassName}>
//                 <FilterList {...filterListProps} />
//             </div>
//         </li>
//     );
// };

// FilterBlock.propTypes = {
//     classes: PropTypes.shape({
//         root: PropTypes.string,
//         layout: PropTypes.string,
//         layoutGrid: PropTypes.string,
//         optionHeader: PropTypes.string,
//         optionToggleButton: PropTypes.string,
//         optionName: PropTypes.string,
//         optionNameExpanded: PropTypes.string,
//         closeWrapper: PropTypes.string,
//         filterList: PropTypes.string,
//         filterListExpanded: PropTypes.string
//     }),
//     item: PropTypes.shape({
//         name: PropTypes.string,
//         filter_items: PropTypes.array,
//         request_var: PropTypes.string
//     })
// };

export default FilterBlock;
