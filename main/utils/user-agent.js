// Native
const os = require('os')

// Utilities
const { version } = require('../../package')

module.exports = `niltree-desktop ${version} node-${process.version} ${os.platform()} (${os.arch()})`
