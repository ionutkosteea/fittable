export function incrementNumber(value?: number): number {
  return (value ?? 0) + 1;
}

export function incrementLetter(value?: number): string {
  let result = '';
  let q: number;
  let r: number;
  let num: number = value ? value + 1 : 1;
  while (num > 0) {
    q = (num - 1) / 26;
    r = (num - 1) % 26;
    num = Math.floor(q);
    result = String.fromCharCode(65 + r) + result;
  }
  return result;
}

export function implementsTKeys<T>(obj: unknown, keys: (keyof T)[]): obj is T {
  if (!obj || !Array.isArray(keys)) {
    return false;
  }
  const implementKeys = keys.reduce(
    (impl: boolean, key: keyof T) => impl && key in obj,
    true
  );
  return implementKeys;
}
