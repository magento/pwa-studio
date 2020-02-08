// TODO: replace with actual graphql calls to the magento instance
// M2 GraphQL doesn't currently support them
export const getMediaConfig = () => {
    return {
        enabled : true,
        links: {
            facebook: 'https://www.facebook.com',
            instagram: 'https://www.instagram.com',
            twitter: 'https://www.twitter.com',
            youtube: 'https://www.youtube.com'
        }
    }
};

