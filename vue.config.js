const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],

  chainWebpack: (config) => {
    config.plugin('define').tap((definitions) => {
      Object.assign(definitions[0], {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false',
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false'
      })
      return definitions
    })
  },

  pluginOptions: {
    vuetify: {
      // Vuetify options here
    }
  },

  // publicPath: process.env.NODE_ENV === 'production' ? '/GEO-INFO-GRAPHICS/' : '/',
  publicPath: './',

  outputDir: 'docs',
})