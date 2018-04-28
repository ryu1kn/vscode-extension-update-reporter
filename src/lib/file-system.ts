class FileSystem {
  private fs: any;

  constructor (params: any) {
    this.fs = params.fs;
  }

  readDirectory (path: string): Promise<string[]> {
    return new Promise((resolve, reject) =>
      this.fs.readdir(path, (err: Error, data: any) => (err ? reject(err) : resolve(data)))
    );
  }

  readFile (path: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this.fs.readFile(
        path,
        'utf8',
        (err: Error, data: any) => (err ? reject(err) : resolve(data))
      )
    );
  }
}

export default FileSystem;
