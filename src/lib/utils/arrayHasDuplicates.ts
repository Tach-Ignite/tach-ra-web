export function arrayHasDuplicates<T extends string | number | symbol>(
  array: T[],
) {
  const valuesSoFar = Object.create(null);
  for (let i = 0; i < array.length; ++i) {
    const value = array[i];
    if (value in valuesSoFar) {
      return true;
    }
    valuesSoFar[value] = true;
  }
  return false;
}
