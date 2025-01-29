const builder = require('electron-builder')
const path = require('path')

builder.build({
  config: {
    directories: {
      output: path.join(process.cwd(), 'electron-dist'),
    },
    files: [
      'dist/**/*',
      'electron/**/*',
    ],
    extends: null,
  }
})