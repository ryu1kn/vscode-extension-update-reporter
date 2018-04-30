export type ObjectMap = {
  [key: string]: any
};

export function mapObject(object: ObjectMap, callback: (value: any) => any): ObjectMap {
  return Object.entries(object).reduce((previous: ObjectMap, [key, value]) =>
    Object.assign({}, previous, {[key]: callback(value)}),
    {}
  );
}

export function toTuples<T>(list: T[]): [T, T][] {
  const tuples: [T, T][] = [];
  for (let i = 0; i < list.length; i += 2) {
    tuples.push([list[i], list[i+1]]);
  }
  return tuples;
}
