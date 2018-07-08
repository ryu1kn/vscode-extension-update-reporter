import * as td from 'testdouble';

export const when = td.when;

export function mock<T>(c: new (...args: any[]) => T): T {
  return new (td.constructor(c));
}

export function mockObject(...propNames: string[]) {
  return td.object(propNames);
}
