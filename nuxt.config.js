
export default {
  server: {
    // port: 8000, // default: 3000
    // host: '192.168.0.103' // default: localhost
  },
  mode: 'universal',
  /*
  ** Global Variables
  */
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Vaccination Game',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { hid: 'themecolor', name: 'theme-color', content: '#0f111b' },
    ],
  },
  loading: {
    color: '#0f111b',
    throttle: 0,
  },
  css: [],
  plugins: [],
  buildModules: [],
  modules: [
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    sass: ['~assets/sass/global.sass']
  }
}
