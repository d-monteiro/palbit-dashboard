const builder = require('electron-builder')
const path = require('path')

// Set the environment variable for Electron build
process.env.ELECTRON = "true"

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