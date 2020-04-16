export default class FileSystem {
  constructor(private readonly fs: any) {}

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
