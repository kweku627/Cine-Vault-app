const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure proper resolution for expo-router
config.resolver.platforms = ['native', 'web', 'ios', 'android'];

module.exports = config;