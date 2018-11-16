export interface TestCase<E, A = E> {
    expected: E;
    actual?: A;
}
