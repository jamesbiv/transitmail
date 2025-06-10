import { DependenciesContext, IDependencies } from "contexts";

/**
 * contextSpyHelper<T>
 * @param {string} dependencyKey
 * @returns {T}
 */
export function contextSpyHelper<T>(dependencyKey: string) {
  const dependenciesContext = DependenciesContext as unknown as { _currentValue: IDependencies };
  const currentValue: IDependencies = dependenciesContext._currentValue;

  return currentValue[dependencyKey as keyof IDependencies] as T;
}
