import { renderHook, act } from '@testing-library/react-hooks';

import { useWishlistItems } from '../useWishlistItems';

test('handlers update active item state', () => {
    const { result } = renderHook(() => useWishlistItems());

    expect(result.current.activeAddToCartItem).toBeNull();

    const activeItem = { id: 1 };
    act(() => {
        result.current.handleOpenAddToCartDialog(activeItem);
    });

    expect(result.current.activeAddToCartItem).toBe(activeItem);

    act(() => {
        result.current.handleCloseAddToCartDialog();
    });

    expect(result.current.activeAddToCartItem).toBeNull();
});
