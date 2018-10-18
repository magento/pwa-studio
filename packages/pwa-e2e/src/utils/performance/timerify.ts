import { performance } from 'perf_hooks';

export function timerify(): MethodDecorator {
  return (target, key, descriptor: TypedPropertyDescriptor<any>) => {
    const oldDescriptor = descriptor.value as (...args: any[]) => void;

    descriptor.value = function wrapper(...args: any[]): any {
      const wrapped = performance.timerify(oldDescriptor);
      const result = wrapped.apply(this, args);

      return result;
    };
    return descriptor;
  };
}
