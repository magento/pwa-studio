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
    GoogleMapsLatLngBoundsConstructor: jest.fn(() => ({
        extend: mocks.googleMapsLatLngBoundsInstanceExtend
    }))
};

mocks.googleMapsInstance = {
    fitBounds: jest.fn(),
    setCenter: jest.fn(),
    setZoom: jest.fn()
};

mocks.googleMaps = {
    InfoWindow: jest.fn(),
    LatLng: jest.fn(() => jest.fn()),
    LatLngBounds: mocks.GoogleMapsLatLngBoundsConstructor,
    Map: jest.fn(() => mocks.googleMapsInstance),
    Marker: jest.fn(() => mocks.googleMapsMarkerInstance),
    event: {
        clearInstanceListeners: jest.fn()
    }
};

const stub = jest.fn();
stub.mockResolvedValue(mocks.googleMaps);

export { mocks };

export default stub;
