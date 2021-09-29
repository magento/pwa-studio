import React, { useEffect, useRef } from 'react';
import { arrayOf, string, bool, number, object, shape } from 'prop-types';
import loadGoogleMapsApi from 'load-google-maps-api';
import defaultClasses from './map.module.css';
import escape from 'lodash.escape';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { mapDefaultProps } from './configAggregator';

const getLocationFormattedAsHtml = location => {
    const name = location.name ? `<h3>${escape(location.name)}</h3>` : '';
    const comment = location.comment
        ? `<p class="map-comment">${escape(location.comment).replace(
              /(?:\r\n|\r|\n)/g,
              '<br>'
          )}</p>`
        : '';
    const phone = location.phone ? `Phone: ${escape(location.phone)}<br>` : '';
    const address = location.address ? `${escape(location.address)}<br>` : '';
    const city = location.city ? escape(location.city) : '';
    const country = location.country ? escape(location.country) : '';
    const state = location.state ? escape(location.state) + ' ' : '';
    const zipCode = location.zipcode ? escape(location.zipcode) : '';
    const cityComma =
        city.length && (state.length || zipCode.length) ? ', ' : '';
    const lineBreak = city.length || zipCode.length ? '<br>' : '';

    return `
    <div class="map-popup">
        ${name}
        ${comment}
        <p><span>${phone}${address}${city}${cityComma}${state}${zipCode}${lineBreak}${country}</span></p>
    </div>
`;
};

/**
 * Page Builder Map component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef GoogleMap
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Map.
 */
const GoogleMap = props => {
    const mapElement = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);

    const {
        apiKey,
        locations,
        height,
        mapOptions,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const dynamicStyles = {
        height,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    useEffect(() => {
        if (!locations.length) {
            return;
        }

        let googleMapsEvent;
        const mapOverlayInstances = [];

        const apiOptions = {
            key: apiKey,
            v: '3'
        };

        loadGoogleMapsApi(apiOptions)
            .then(googleMaps => {
                googleMapsEvent = googleMaps.event;

                const map = new googleMaps.Map(mapElement.current, mapOptions);
                const positions = [];

                let activeInfoWindow;

                locations.forEach(location => {
                    const position = new googleMaps.LatLng(
                        location.position.latitude,
                        location.position.longitude
                    );
                    positions.push(position);

                    const marker = new googleMaps.Marker({
                        map,
                        position,
                        title: location.name
                    });

                    const infoWindow = new googleMaps.InfoWindow({
                        content: getLocationFormattedAsHtml(location),
                        maxWidth: 350
                    });

                    marker.addListener('click', () => {
                        // close other open info window if present
                        if (activeInfoWindow) {
                            activeInfoWindow.close();
                        }

                        infoWindow.open(map, marker);
                        activeInfoWindow = infoWindow;
                    });

                    mapOverlayInstances.push(marker);
                    mapOverlayInstances.push(infoWindow);
                });

                // set the bounds of the map to the perimeter of the furthest locations in either direction
                if (positions.length > 1) {
                    const latitudeLongitudeBounds = new googleMaps.LatLngBounds();

                    positions.forEach(position => {
                        latitudeLongitudeBounds.extend(position);
                    });

                    map.fitBounds(latitudeLongitudeBounds);
                }

                // zoom to default zoom if there is only a single location
                if (positions.length === 1) {
                    map.setCenter(positions[0]);
                    map.setZoom(mapDefaultProps.mapOptions.zoom);
                }
            })
            .catch(error => console.error(error));

        return () => {
            if (!googleMapsEvent) {
                return;
            }

            mapOverlayInstances.forEach(mapOverlayInstance => {
                googleMapsEvent.clearInstanceListeners(mapOverlayInstance);
            });
        };
    }, [apiKey, locations, mapOptions]);

    // If there are no locations configured, do not render the map
    if (!locations.length) {
        return null;
    }

    return (
        <div
            ref={mapElement}
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
        />
    );
};

/**
 * Props for {@link GoogleMap}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Map
 * @property {String} classes.root CSS class for the root element
 * @property {String} apiKey API key for Maps API usage
 * @property {String} height CSS height property
 * @property {Object} mapOptions specific Google Maps API options for Map object instantiation
 * @property {Array} locations Locations on the map for Marker placement
 * @property {String} textAlign Alignment of content within the row
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
GoogleMap.propTypes = {
    classes: shape({
        root: string
    }),
    apiKey: string,
    height: string,
    mapOptions: shape({
        zoom: number,
        center: shape({
            lat: number,
            lng: number
        }),
        scrollwheel: bool,
        disableDoubleClickZoom: bool,
        disableDefaultUI: bool,
        mapTypeControl: bool,
        mapTypeControlStyle: shape({
            style: number
        })
    }),
    locations: arrayOf(
        shape({
            position: shape({
                latitude: number.isRequired,
                longitude: number.isRequired
            }),
            name: string,
            phone: string,
            address: string,
            city: string,
            state: string,
            zipcode: string,
            country: string,
            comment: string,
            styles: arrayOf(
                shape({
                    featureType: string,
                    elementType: string,
                    stylers: arrayOf(object)
                })
            )
        })
    ).isRequired,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

GoogleMap.defaultProps = mapDefaultProps;

export default GoogleMap;
