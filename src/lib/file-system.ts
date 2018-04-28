class FileSystem {
  private _fs: any;

  constructor (params: any) {
    this._fs = params.fs;
  }

  readDirectory (path: string): Promise<string[]> {
    return new Promise((resolve, reject) =>
      this._fs.readdir(path, (err: Error, data: any) => (err ? reject(err) : resolve(data)))
    );
  }

  readFile (path: string): Promise<string> {
    return new Promise((resolve, reject) =>
      this._fs.readFile(
        path,
        'utf8',
        (err: Error, data: any) => (err ? reject(err) : resolve(data))
      )
    );
  }
}

export default FileSystem;
