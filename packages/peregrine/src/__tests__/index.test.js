import Peregrine from '..';
import Peregrine2 from '../Peregrine';

test('Re-exports Peregrine', () => {
    expect(Peregrine).toBe(Peregrine2);
});
