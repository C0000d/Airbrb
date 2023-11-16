const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    testIsolation: false,
    // supportFile: false,
    "viewportWidth": 720,
    "viewportHeight": 1080
  },
})
