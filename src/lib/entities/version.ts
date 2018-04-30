
export class Version {
  private major: number;
  private minor: number;
  private patch: number;

  constructor (major: number, minor: number, patch: number) {
    this.major = major;
    this.minor = minor;
    this.patch = patch;
  }

  isHigherThan (other: Version) {
    return this.major > other.major
      || (this.major === other.major && this.minor > other.minor)
      || (this.major === other.major && this.minor === other.minor && this.patch > other.patch);
  }

  toString (): string {
    return [this.major, this.minor, this.patch].join('.');
  }
}

export function parseVersion (version: string): Version {
  const match = /(\d+)\.(\d+)\.(\d+)/.exec(version);
  if (!match) throw new Error('Version malformed');
  return new Version(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
}

export function isValidVersion (version: string): boolean {
  return /(\d+)\.(\d+)\.(\d+)/.test(version);
}
