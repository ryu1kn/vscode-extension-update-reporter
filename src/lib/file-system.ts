export default class FileSystem {
  private readonly fs: any;

  constructor(fs: any) {
    this.fs = fs;
  }

  readDirectory(path: string): Promise<string[]> {
    return new Promise((resolve, reject) =>
      this.fs.readdir(path, (err: Error, data: string[]) => (err ? reject(err) : resolve(data)))
    );
  }

  readFile(path: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.fs.readFile(
        path,
        'utf8',
        (err: Error, data: string) => (err ? reject(err) : resolve(data))
      )
    );
  }
}
