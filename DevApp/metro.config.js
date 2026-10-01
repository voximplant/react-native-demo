const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const path = require('path')

const defaultConfig = getDefaultConfig(__dirname)

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  watchFolders: [],
  resolver: {
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
    extraNodeModules: []
  }
}

module.exports = mergeConfig(defaultConfig, config)
