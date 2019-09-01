export type ObjectMap<T> = {
  [key: string]: T;
};

export class PowerMap<T> {
  private readonly map: Map<string, T>;

  constructor(object: ObjectMap<T>) {
    this.map = toMap(object);
  }

  get(key: string, defaultValue: T): T {
    return this.map.get(key) || defaultValue;
  }
}

function toMap<T>(object: ObjectMap<T>): Map<string, T> {
  const tuples = Object.entries(object).reduce(
    (previous: [string, T][], currentValue) => [...previous, currentValue],
    []
  );
  return new Map(tuples);
}

export function mapObject<T, S>(object: ObjectMap<T>, callback: (value: T) => S): ObjectMap<S> {
  return Object.entries(object).reduce((previous: ObjectMap<S>, [key, value]) =>
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
