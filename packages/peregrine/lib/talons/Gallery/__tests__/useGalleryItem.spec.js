import { useGalleryItem } from '../useGalleryItem';
test('returns empty object', () => {
    const props = useGalleryItem({});
    expect(props).toEqual({});
});
