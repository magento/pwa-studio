import { useGalleryItem } from '../useGalleryItem';
test('returns object handelLinkClick as a function', () => {
    const props = useGalleryItem({});
    expect(props).toEqual(
        expect.objectContaining({ handleLinkClick: expect.any(Function) })
    );
});
