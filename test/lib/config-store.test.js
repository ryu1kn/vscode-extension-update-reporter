const td = require('testdouble')

const ConfigStore = require('../../lib/config-store')

describe('ConfigStore', () => {
  let configSection
  let configStore

  beforeEach(() => {
    const workspace = td.object('getConfiguration')
    configSection = td.object(['get', 'update'])
    td
      .when(configSection.get('extensionVersions'))
      .thenReturn({ EXT_1: '0.1.0' })
    td
      .when(workspace.getConfiguration('changelogChecker'))
      .thenReturn(configSection)
    configStore = new ConfigStore({ vscWorkspace: workspace })
  })

  it('saves the current version of an extension if not saved yet', async () => {
    await configStore.registerAllExtensions({
      EXT_1: '0.1.0',
      EXT_2: '0.2.0'
    })

    td.verify(
      configSection.update(
        'extensionVersions',
        { EXT_1: '0.1.0', EXT_2: '0.2.0' },
        true
      )
    )
  })

  it("doesn't update the extension version", async () => {
    await configStore.registerAllExtensions({
      EXT_1: '0.2.0'
    })

    td.verify(configSection.update(), { times: 0, ignoreExtraArgs: true })
  })
})
