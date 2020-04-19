import { renderHook, act } from '@testing-library/react-hooks';
import { useSort } from '../useSort';

test('should render without an error', () => {
    const { result } = renderHook(() => useSort());
    expect(result.current.sortText).toBe('Best Match');
});

test('should render with a differnt sort order', () => {
    const { result } = renderHook(() =>
        useSort({
            sortAttribute: 'price',
            sortDirection: 'ASC'
        })
    );

    expect(result.current.sortText).toBe('Price: Low to High');
});

test('should render with updated sort order', () => {
  const { result } = renderHook(() => useSort());

  expect(result.current.sortText).toBe('Best Match');
  act(() => {
    result.current.api.sortControl.setSort({
        sortAttribute: 'price',
        sortDirection: 'ASC'
    })
  })

  expect(result.current.sortText).toBe('Price: Low to High');
})