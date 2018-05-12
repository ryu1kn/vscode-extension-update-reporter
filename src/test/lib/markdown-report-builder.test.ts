import * as assert from 'assert';

import MarkdownReportBuilder from '../../lib/markdown-report-builder';
import { LoadedExtension } from '../../lib/entities/extension';
import ChangelogParser from '../../lib/changelog-parser';
import * as vscode from 'vscode';
import {parseVersion} from '../../lib/entities/version';
import {left, right} from 'fp-ts/lib/Either';

const multiline = require('multiline-string')();

describe('MarkdownReportBuilder', () => {
  const changelogParser = new ChangelogParser();
  const builder = new MarkdownReportBuilder();

  it('creates an updates summary', () => {
    const extension1 = createExtension({
      id: 'EXT1',
      displayName: 'EXT_NAME_1',
      knownVerion: parseVersion('1.0.0'),
      lastRecordedVersion: parseVersion('0.8.0'),
      changelogText: multiline(`
        The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

        ## [1.0.0] - 2018-04-21
        ### Added
        - foo2
        - bar

        ## [0.9.0] - 2018-04-20
        ### Added
        - foo

        ## [0.8.0] - 2018-04-19
        ### Added
        - baz
        `)
    });
    const extension2 = createExtension({
      id: 'EXT2',
      displayName: 'EXT_NAME_2',
      knownVerion: parseVersion('0.1.0'),
      lastRecordedVersion: parseVersion('0.0.9'),
      changelogText: multiline(`
        The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)

        ## [0.1.0] - 2018-04-22
        ### Removed
        - baz

        ## [0.0.9] - 2018-04-21
        ### Removed
        - foo
        `)
    });

    assert.deepEqual(
      builder.build([extension1, extension2]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_1
      ### [1.0.0]
      #### Added
      - foo2
      - bar

      ### [0.9.0]
      #### Added
      - foo

      ## EXT_NAME_2
      ### [0.1.0]
      #### Removed
      - baz
      `)
    );
  });

  it('shows a message that changelog is not available', () => {
    const extension = createExtension({
      id: 'EXT3',
      displayName: 'EXT_NAME_3',
      knownVerion: parseVersion('1.3.0'),
      lastRecordedVersion: parseVersion('0.0.1'),
      changelogText: multiline(`
        ### 1-3-0
        * foo
        `)
    });

    assert.deepEqual(
      builder.build([extension]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_3
      Changelog not found or cannot be parsed.
      `)
    );
  });

  it('shows a message that changelog is not found', () => {
    const extension = createExtension({
      id: 'EXT3',
      displayName: 'EXT_NAME_3',
      knownVerion: parseVersion('1.3.0'),
      lastRecordedVersion: parseVersion('0.0.1'),
      errorMessage: 'ERROR_MESSAGE'
    });

    assert.deepEqual(
      builder.build([extension]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_3
      ERROR_MESSAGE
      `)
    );
  });

  it('increases an indent level of each header in the change description', () => {
    const extension = createExtension({
      id: 'EXT3',
      displayName: 'EXT_NAME_3',
      knownVerion: parseVersion('1.3.0'),
      lastRecordedVersion: parseVersion('0.0.1'),
      changelogText: multiline(`
        ### 1.3.0
        * foo
        
        ### Fixes:
        * bar
        `)
    });

    assert.deepEqual(
      builder.build([extension]),
      multiline(`
      # Extension Updates

      ## EXT_NAME_3
      ### [1.3.0]
      * foo
      
      #### Fixes:
      * bar
      `)
    );
  });

  function createExtension ({ id, displayName, changelogText, knownVerion, lastRecordedVersion, errorMessage }: any) {
    const extensionRaw = { id, packageJSON: { displayName } } as vscode.Extension<any>;
    if (errorMessage) return new LoadedExtension(extensionRaw, lastRecordedVersion, left(errorMessage));

    const changelog = changelogParser.parse(changelogText, knownVerion);
    return new LoadedExtension(extensionRaw, lastRecordedVersion, right(changelog));
  }
});
