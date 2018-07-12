import timeout from 'src/util/timeout';
import {
    drawerClose as closeMs,
    drawerOpen as openMs
} from 'src/shared/durations';

export const toggleDrawer = drawerName => dispatch => {
    dispatch({
        type: 'TOGGLE_DRAWER',
        payload: drawerName
    });
    return timeout(drawerName ? openMs : closeMs);
};

export const closeDrawer = () => toggleDrawer(null);
