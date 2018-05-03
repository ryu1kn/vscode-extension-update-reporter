import * as assert from 'assert';
import {parseVersion} from '../../../lib/entities/version';

describe('Version', () => {
  const v100 = parseVersion('1.0.0');
  const v010 = parseVersion('0.1.0');

  it('tells if its version is higher than that of the other one', () => {
    assert.ok(v100.isHigherThan(v010));
  });

  it('tells if its version is NOT higher than that of the other one', () => {
    assert.ok(!v010.isHigherThan(v100));
  });
});
