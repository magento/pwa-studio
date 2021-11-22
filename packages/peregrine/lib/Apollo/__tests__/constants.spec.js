import { CACHE_PERSIST_PREFIX } from '../constants';

describe('#constants', () => {
    it('returns value', () => {
        expect(CACHE_PERSIST_PREFIX).toMatchInlineSnapshot(
            `"apollo-cache-persist"`
        );
    });
});
