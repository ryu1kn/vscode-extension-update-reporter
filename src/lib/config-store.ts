import { EXTENSION_ID } from './const';
const EXTENSION_VERSION_MAP = 'extensionVersions';

export default class ConfigStore {
  private vscWorkspace: any;

  constructor (params: any) {
    this.vscWorkspace = params.vscWorkspace;
  }

  get extensionVersions () {
    return this.extensionConfig.get(EXTENSION_VERSION_MAP);
  }

  private get extensionConfig () {
    return this.vscWorkspace.getConfiguration(EXTENSION_ID);
  }

  registerAllExtensions (extensionVersions: any) {
    const registeredVersions = this.extensionVersions;
    const newExtensionIds = Object.keys(extensionVersions).filter(
      extensionId => !registeredVersions[extensionId]
    );
    if (newExtensionIds.length === 0) { return; }

    const newExtensionsMap = newExtensionIds.reduce(
      (accumulated: any, extensionId: any) =>
        Object.assign({}, accumulated, { [extensionId]: extensionVersions[extensionId] }),
      {}
    );
    const newRegisteredVersions = Object.assign(
      {},
      registeredVersions,
      newExtensionsMap
    );
    return this.extensionConfig.update(
      EXTENSION_VERSION_MAP,
      newRegisteredVersions,
      true
    );
  }
}
