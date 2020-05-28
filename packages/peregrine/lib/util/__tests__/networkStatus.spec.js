import { NETOWRK_STATUS, isNetworkRequestInFlight } from '../networkStatus';

test('isNetworkRequestInFlight should return true if the network status is less than READY status', () => {
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.LOADING)).toBeTruthy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.SET_VARIABLES)).toBeTruthy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.FETCH_MORE)).toBeTruthy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.REFETCH)).toBeTruthy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.POLL)).toBeTruthy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.READY)).toBeFalsy();
    expect(isNetworkRequestInFlight(NETOWRK_STATUS.ERROR)).toBeFalsy();
});
