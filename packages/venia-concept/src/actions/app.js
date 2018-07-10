import timeout from 'src/util/timeout';
import { drawer as drawerMs } from 'src/shared/durations';

export const toggleDrawer = drawerName => async dispatch => {
    dispatch({
        type: 'TOGGLE_DRAWER',
        payload: drawerName
    });
    return timeout(drawerMs);
};

export const closeDrawer = () => toggleDrawer(null);
