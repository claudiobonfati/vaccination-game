
export default {
  server: {
    // port: 8000, // default: 3000
    host: '192.168.0.103' // default: localhost
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
      { hid: 'msapplicationtilecolor', name: 'msapplication-TileColor', content: '#0f111b' },
      { hid: 'msapplicationtileimage', name: 'msapplication-TileImage', content: '/favicon/ms-icon-144x144.png' },
      { hid: 'themecolor', name: 'theme-color', content: '#0f111b' },
      { property: 'og:url', content: process.env.BASE_URL || 'http://localhost:3000' },
      { property: 'og:title', content: 'Vaccination Game' },
      { property: 'og:description', content: process.env.npm_package_description || '' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${process.env.BASE_URL}/img/vaccination-game-og.png` || 'http://localhost:3000/img/vaccination-game-og.png' },
      { property: 'og:image:width', content: '1080' },
      { property: 'og:image:height', content: '1080' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:locale', content: 'pt_BR' },
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
