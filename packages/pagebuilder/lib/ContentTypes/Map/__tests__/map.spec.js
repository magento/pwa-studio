import React from 'react';
import { createTestInstance } from '@magento/peregrine';
import GoogleMap from '../map';
import loadGoogleMapsApi from 'load-google-maps-api';
import stub, { mocks } from '../__mocks__/loadGoogleMapsApi';
import { mapDefaultProps } from '../configAggregator';
import { act } from 'react-test-renderer';

jest.mock('load-google-maps-api', () =>
    require('../__mocks__/loadGoogleMapsApi')
);

test('render map with no props', () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const component = createTestInstance(<GoogleMap />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('render map with all props configured', () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        appearance: 'default',
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 0
                }
            }
        ],
        height: '200px',
        textAlign: 'right',
        border: 'solid',
        borderColor: 'red',
        borderWidth: '10px',
        borderRadius: '15px',
        marginTop: '10px',
        marginRight: '10px',
        marginBottom: '10px',
        marginLeft: '10px',
        paddingTop: '10px',
        paddingRight: '10px',
        paddingBottom: '10px',
        paddingLeft: '10px',
        cssClasses: ['test-class']
    };

    const component = createTestInstance(<GoogleMap {...mapProps} />);

    expect(component.toJSON()).toMatchSnapshot();
});

test('map with locations calls loadGoogleMapsApi', () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const locations = [
        {
            position: {
                latitude: 0,
                longitude: 0
            }
        }
    ];

    createTestInstance(<GoogleMap apiKey="API_KEY" locations={locations} />);
    expect(loadGoogleMapsApi).toHaveBeenCalledWith({
        key: 'API_KEY',
        v: '3'
    });
});

test('map without locations does not call loadGoogleMapsApi', () => {
    createTestInstance(<GoogleMap />);
    expect(loadGoogleMapsApi).not.toHaveBeenCalled();
});

test('map with 1 location', async () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        locations: [
            {
                name: 'Adobe',
                comment: 'Main Office',
                address: '123 Fake St',
                city: 'San Jose',
                state: 'CA',
                zipcode: '12345',
                country: 'USA',
                phone: '123-456-7890',
                position: {
                    latitude: 0,
                    longitude: 1
                }
            }
        ]
    };

    await createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    const locations = mapProps.locations;

    expect(mocks.googleMaps.LatLng.mock.calls).toEqual([
        [locations[0].position.latitude, locations[0].position.longitude]
    ]);
    expect(mocks.googleMaps.InfoWindow).toHaveBeenCalledTimes(locations.length);
    expect(mocks.googleMaps.Marker).toHaveBeenCalledTimes(locations.length);
    expect(mocks.googleMapsMarkerInstance.addListener).toHaveBeenCalledTimes(
        locations.length
    );
    expect(mocks.googleMapsInstance.fitBounds).not.toHaveBeenCalled();
    expect(mocks.googleMapsInstance.setCenter).toHaveBeenCalledTimes(
        locations.length
    );
    expect(mocks.googleMapsInstance.setZoom).toHaveBeenCalledWith(
        mapDefaultProps.mapOptions.zoom
    );
});

test('map with > 1 location', async () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 1
                }
            },
            {
                name: 'Somewhere else',
                city: 'Next Door',
                state: 'OR',
                position: {
                    latitude: 0,
                    longitude: 2
                }
            }
        ]
    };

    await createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    const locations = mapProps.locations;

    expect(mocks.googleMaps.LatLng.mock.calls).toEqual([
        [locations[0].position.latitude, locations[0].position.longitude],
        [locations[1].position.latitude, locations[1].position.longitude]
    ]);
    expect(mocks.googleMaps.InfoWindow).toHaveBeenCalledTimes(locations.length);
    expect(mocks.googleMaps.Marker).toHaveBeenCalledTimes(locations.length);
    expect(mocks.googleMapsMarkerInstance.addListener).toHaveBeenCalledTimes(
        locations.length
    );
    expect(mocks.googleMaps.LatLngBounds).toHaveBeenCalledTimes(1);
    expect(mocks.googleMapsInstance.fitBounds).toHaveBeenCalledTimes(1);

    expect(mocks.googleMapsLatLngBoundsInstanceExtend).toHaveBeenCalledTimes(
        locations.length
    );

    expect(mocks.googleMapsInstance.setCenter).not.toHaveBeenCalled();
    expect(mocks.googleMapsInstance.setZoom).not.toHaveBeenCalled();
});

test('map unmount causes event listeners to be unbound', async () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 1
                }
            }
        ]
    };

    const component = await createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    act(() => {
        component.unmount();
    });

    expect(mocks.googleMaps.event.clearInstanceListeners).toHaveBeenCalledTimes(
        2
    );
});

test('useEffect cleanup before loadGoogleMapsApi is resolved', async () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 1
                }
            }
        ]
    };

    const eventMock = mocks.googleMaps.event;
    delete mocks.googleMaps.event;

    const component = await createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    component.unmount();

    mocks.googleMaps.event = eventMock;
    expect(
        mocks.googleMaps.event.clearInstanceListeners
    ).not.toHaveBeenCalled();
});

test('catch calls console.error', finish => {
    stub.mockRejectedValue('Something went wrong');

    jest.spyOn(console, 'error').mockImplementation(() => {});

    const mapProps = {
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 1
                }
            }
        ]
    };

    createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    // async/await does not work here (promise rejection happens after expectation)
    setTimeout(() => {
        expect(console.error).toHaveBeenCalledWith('Something went wrong');
        finish();
    }, 0);
});

test('clicking on marker', async () => {
    stub.mockResolvedValue(mocks.googleMaps);

    const mapProps = {
        locations: [
            {
                position: {
                    latitude: 0,
                    longitude: 1
                }
            }
        ]
    };

    await createTestInstance(<GoogleMap {...mapProps} />, {
        createNodeMock: () => {
            return true;
        }
    });

    expect(mocks.googleMapsMarkerInstance.addListener).toHaveBeenCalledTimes(1);

    const eventListenerCallback =
        mocks.googleMapsMarkerInstance.addListener.mock.calls[0][1];

    eventListenerCallback();
    expect(mocks.googleMapsInfoWindowInstanceOpen).toHaveBeenCalledWith(
        mocks.googleMapsInstance,
        mocks.googleMapsMarkerInstance
    );

    eventListenerCallback();
    expect(mocks.googleMapsInfoWindowInstanceClose).toHaveBeenCalledTimes(1);
    expect(mocks.googleMapsInfoWindowInstanceOpen).toHaveBeenCalledWith(
        mocks.googleMapsInstance,
        mocks.googleMapsMarkerInstance
    );
});
