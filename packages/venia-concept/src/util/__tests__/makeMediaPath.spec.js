import { makePathPrepender } from '../makeMediaPath';
const fooTrailingSlash = '/foo/';
const fooNoTrailingSlash = '/foo';

test('makePathPrepender makes a function that returns a path', () => {
    const makePath = makePathPrepender(fooNoTrailingSlash);
    expect(makePath('nothing')).toBe('/foo/nothing');
});

test('makePathPrepender makes a function that removes extra slashes', () => {
    const makePath = makePathPrepender(fooTrailingSlash);
    expect(makePath('/nothing///')).toBe('/foo/nothing');
});
