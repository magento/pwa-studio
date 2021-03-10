import { useGalleryItem } from '../useGalleryItem';
test('returns object handelLinkClick as a function', () => {
    const expectedReturnValue = {
        handleLinkClick: () => {}
    };
    const props = useGalleryItem({});
    expect(JSON.stringify(props)).toBe(JSON.stringify(expectedReturnValue));
});
