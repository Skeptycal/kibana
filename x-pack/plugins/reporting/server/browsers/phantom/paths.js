/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import path from 'path';

export const paths = {
  archivesPath: path.resolve(__dirname, '../../../.phantom'),
  baseUrl: 'https://github.com/Medium/phantomjs/releases/download/v2.1.1/',
  packages: [{
    platforms: ['darwin', 'freebsd', 'openbsd'],
    archiveFilename: 'phantomjs-2.1.1-macosx.zip',
    archiveChecksum: 'b0c038bd139b9ecaad8fd321070c1651',
    rawChecksum: 'bbebe2381435309431c9d4e989aefdeb',
    binaryRelativePath: 'phantomjs-2.1.1-macosx/bin/phantomjs',
  }, {
    platforms: ['linux'],
    archiveFilename: 'phantomjs-2.1.1-linux-x86_64.tar.bz2',
    archiveChecksum: '1c947d57fce2f21ce0b43fe2ed7cd361',
    rawChecksum: '3f4bbbe5acd45494d8e52941936235f2',
    binaryRelativePath: 'phantomjs-2.1.1-linux-x86_64/bin/phantomjs'
  }, {
    platforms: ['win32'],
    archiveFilename: 'phantomjs-2.1.1-windows.zip',
    archiveChecksum: '4104470d43ddf2a195e8869deef0aa69',
    rawChecksum: '339f74c735e683502c43512a508e53d6',
    binaryRelativePath: 'phantomjs-2.1.1-windows\\bin\\phantomjs.exe'
  }]
};
