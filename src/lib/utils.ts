export type ObjectMap = {
  [key: string]: any
};

export function mapObject(object: ObjectMap, callback: (value: any) => any): ObjectMap {
  return Object.entries(object).reduce((previous: ObjectMap, [key, value]) =>
    Object.assign({}, previous, {[key]: callback(value)}),
    {}
  );
}
