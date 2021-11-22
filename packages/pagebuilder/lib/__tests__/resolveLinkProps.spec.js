import resolveLinkProps from '../resolveLinkProps';

describe('resolve to internal link', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';

    test('when base url matches', () => {
        const linkProps = resolveLinkProps('http://magento.com/cms-page');
        expect(linkProps).toEqual({
            to: '/cms-page'
        });
    });

    test('when base url matches product URL', () => {
        const linkProps = resolveLinkProps(
            'http://magento.com/product-page.html'
        );
        expect(linkProps).toEqual({
            to: '/product-page.html'
        });
    });

    test('with root-relative url', () => {
        const linkProps = resolveLinkProps('/cms-page');
        expect(linkProps).toEqual({
            to: '/cms-page'
        });
    });

    test('with relative url', () => {
        const linkProps = resolveLinkProps('cms-page');
        expect(linkProps).toEqual({
            to: '/cms-page'
        });
    });
});

test('resolve to external anchor if external link', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const linkProps = resolveLinkProps(
        'http://not-magento.com/product-page.html'
    );
    expect(linkProps).toEqual({
        href: 'http://not-magento.com/product-page.html'
    });
});

test('return original input if input is invalid', () => {
    process.env.MAGENTO_BACKEND_URL = null;
    const linkProps = resolveLinkProps(null);
    expect(linkProps).toEqual({
        href: null
    });
});
