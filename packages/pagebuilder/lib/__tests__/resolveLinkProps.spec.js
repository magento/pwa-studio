import resolveLinkProps from '../resolveLinkProps';

test('resolve to internal link if base url matches', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const linkProps = resolveLinkProps('http://magento.com/cms-page');
    expect(linkProps).toEqual({
        to: '/cms-page'
    });
});

test('resolve to internal link if base url matches for product URL', () => {
    process.env.MAGENTO_BACKEND_URL = 'http://magento.com/';
    const linkProps = resolveLinkProps('http://magento.com/product-page.html');
    expect(linkProps).toEqual({
        to: '/product-page.html'
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
    const linkProps = resolveLinkProps(null);
    expect(linkProps).toEqual({
        href: null
    });
});
