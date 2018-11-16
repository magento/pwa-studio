export const component =
  <T extends (root: Selector) => any>(componentLike: T) =>
    componentLike;
