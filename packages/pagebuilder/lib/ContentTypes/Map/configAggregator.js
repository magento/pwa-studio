import { getAdvanced } from '../../utils';

export default node => {
    const locations = JSON.parse(node.getAttribute('data-locations')).map(
        location => {
            location.name = location.location_name;
            delete location.location_name;
            location.country = Array.isArray(location.country)
                ? location.country.join(' ')
                : location.country;

            return location;
        }
    );

    const isShowControls = node.getAttribute('data-show-controls') === 'true';

    return {
        height: node.style.height,
        locations,
        mapOptions: Object.assign({}, mapDefaultProps.mapOptions, {
            disableDefaultUI: !isShowControls,
            mapTypeControl: isShowControls
        }),
        ...getAdvanced(node)
    };
};

export const mapDefaultProps = {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
    locations: [],
    mapOptions: {
        zoom: 8,
        scrollwheel: false,
        disableDoubleClickZoom: false,
        disableDefaultUI: false,
        mapTypeControl: true
    }
};
