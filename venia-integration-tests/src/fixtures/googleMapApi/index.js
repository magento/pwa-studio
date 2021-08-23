export const createGoogleMapApi = currentMapApi => {
    return {
        maps: {
            Map: class Map {
                constructor(element, options) {
                    this.element = element;
                    this.options = options;

                    const noticeContainer = document.createElement('h2');
                    const noticeContent = document.createTextNode(
                        'Google API mocked for testing'
                    );
                    noticeContainer.appendChild(noticeContent);
                    this.element.append(noticeContainer);

                    const mapInfoWindowContainer = document.createElement(
                        'div'
                    );
                    this.element.append(mapInfoWindowContainer);
                    this.infoWindowContainer = mapInfoWindowContainer;

                    currentMapApi.map = { element, options };
                }

                fitBounds(bounds) {
                    currentMapApi.map.bounds = bounds;
                }

                setCenter(center) {
                    currentMapApi.map.center = center;
                }

                setZoom(zoom) {
                    currentMapApi.map.zoom = zoom;
                }
            },
            LatLng: class LatLng {
                constructor(latitude, longitude) {
                    this.latitude = latitude;
                    this.longitude = longitude;
                    currentMapApi.latLng.push({ latitude, longitude });
                }
            },
            Marker: class Marker {
                constructor({ map, position, title }) {
                    this.map = map;
                    this.position = position;
                    this.title = title;

                    const markerElement = document.createElement('div');
                    markerElement.classList.add('cp-marker-element');
                    const markerTitle = document.createElement('h3');
                    const markerTitleContent = document.createTextNode(
                        `${this.title} (${this.position.latitude}, ${
                            this.position.longitude
                        })`
                    );
                    markerTitle.appendChild(markerTitleContent);
                    markerElement.appendChild(markerTitle);
                    this.map.element.append(markerElement);

                    this.element = markerElement;

                    currentMapApi.marker.push({
                        map,
                        position,
                        title
                    });
                }

                addListener(type, listener) {
                    this.element.addEventListener(type, listener);
                }
            },
            InfoWindow: class InfoWindow {
                constructor({ content, maxWidth }) {
                    this.content = content;
                    this.maxWidth = maxWidth;

                    currentMapApi.infoWindow.push({
                        content,
                        maxWidth
                    });
                }

                open(map) {
                    map.infoWindowContainer.style.maxWidth = this.maxWidth;
                    map.infoWindowContainer.innerHTML = this.content;
                }

                close() {
                    return false;
                }
            },
            LatLngBounds: class LatLngBounds {
                extend(position) {
                    return position;
                }
            },
            event: {
                clearInstanceListeners: a => {
                    return a;
                }
            }
        }
    };
};
