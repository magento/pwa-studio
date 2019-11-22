import React from 'react';

import Trigger from '../Trigger';
import Icon from '../Icon';
import GridIcon from 'react-feather/dist/icons/grid';
import ListIcon from 'react-feather/dist/icons/list';

const ListGridSwitcher = props => {
    const { listGridToggle, isList } = props;
    const icon = isList ? GridIcon : ListIcon;

    return (
        <Trigger key="switchButton" action={listGridToggle}>
            <Icon src={icon} />
        </Trigger>
    );
};

export default ListGridSwitcher;
