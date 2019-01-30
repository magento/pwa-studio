import React from 'react';
import MenuItem from './menuItem';
import { Link } from 'src/drivers';

const MenuItemButton = props => (
    <MenuItem component="button" type="button" {...props} />
);
const MenuItemLink = props => <MenuItem component={Link} {...props} />;

export default {
    Link: MenuItemLink,
    Button: MenuItemButton
};
