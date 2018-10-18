export type Model<T extends Model<T>> = {
  [P in keyof T]?: T[P];
};
