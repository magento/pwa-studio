const mocks = {
    googleMapsInstance: {
        fitBounds: jest.fn(),
        setCenter: jest.fn(),
        setZoom: jest.fn()
    },
    googleMapsMarkerInstance: {
        addListener: jest.fn()
    },
    googleMapsLatLngBoundsInstanceExtend: jest.fn(),
    googleMapsInfoWindowInstanceOpen: jest.fn(),
    googleMapsInfoWindowInstanceClose: jest.fn(),
    GoogleMapsLatLngBoundsConstructor: jest.fn(() => ({
        extend: mocks.googleMapsLatLngBoundsInstanceExtend
    })),
    GoogleMapsInfoWindowConstructor: jest.fn(() => ({
        open: mocks.googleMapsInfoWindowInstanceOpen,
        close: mocks.googleMapsInfoWindowInstanceClose
    }))
};

mocks.googleMaps = {
    InfoWindow: mocks.GoogleMapsInfoWindowConstructor,
    LatLng: jest.fn(() => jest.fn()),
    LatLngBounds: mocks.GoogleMapsLatLngBoundsConstructor,
    Map: jest.fn(() => mocks.googleMapsInstance),
    Marker: jest.fn(() => mocks.googleMapsMarkerInstance),
    event: {
        clearInstanceListeners: jest.fn()
    }
};

const stub = jest.fn(); // acts as promise in test

export { mocks };

export default stub;
