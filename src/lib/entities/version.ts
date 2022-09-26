
export interface Version {
  isHigherThan(other: Version): boolean;
}

class ValidVersion implements Version {
  constructor(private readonly major: number,
              private readonly minor: number,
              private readonly patch: number) {}

  isHigherThan(other: Version): boolean {
    if (other instanceof ValidVersion) {
      return this.major > other.major
        || (this.major === other.major && this.minor > other.minor)
        || (this.major === other.major && this.minor === other.minor && this.patch > other.patch);
    }
    return false;
  }

  toString(): string {
    return [this.major, this.minor, this.patch].join('.');
  }
}

class NullVersion implements Version {
  isHigherThan(_other: Version) {
    return false;
  }
}

export function createNullVersion(): NullVersion {
  return new NullVersion();
}

export function parseVersion(version: string): Version {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!match) return createNullVersion();
  return new ValidVersion(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
}

export function isValidVersion(version: string): boolean {
  return /(\d+)\.(\d+)\.(\d+)/.test(version);
}
