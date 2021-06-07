
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
    baseUrl: process.env.BASE_URL || 'http://localhost:3000/vaccination-game',
  },
  router: {
    base: '/vaccination-game/',
  },
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: 'Vaccination Game',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { hid: 'description', name: 'description', content: 'A game that shows minimalistically how to eradicate a disease in a population.' },
      { hid: 'msapplicationtilecolor', name: 'msapplication-TileColor', content: '#0f111b' },
      { hid: 'msapplicationtileimage', name: 'msapplication-TileImage', content: '/favicon/ms-icon-144x144.png' },
      { hid: 'themecolor', name: 'theme-color', content: '#0f111b' },
      { property: 'og:url', content: process.env.BASE_URL || 'http://localhost:3000/vaccination-game/' },
      { property: 'og:title', content: 'Vaccination Game' },
      { property: 'og:description', content: 'A game that shows minimalistically how to eradicate a disease in a population.' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: `${process.env.BASE_URL || ''}/img/vaccination-game-og.png` },
      { property: 'og:image:width', content: '1080' },
      { property: 'og:image:height', content: '1080' },
      { property: 'og:image:type', content: 'image/png' },
      { property: 'og:locale', content: 'pt_BR' },
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '57x57', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-57x57.png` },
      { rel: 'apple-touch-icon', sizes: '60x60', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-60x60.png` },
      { rel: 'apple-touch-icon', sizes: '72x72', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-72x72.png` },
      { rel: 'apple-touch-icon', sizes: '76x76', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-76x76.png` },
      { rel: 'apple-touch-icon', sizes: '114x114', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-114x114.png` },
      { rel: 'apple-touch-icon', sizes: '120x120', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-120x120.png` },
      { rel: 'apple-touch-icon', sizes: '144x144', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-144x144.png` },
      { rel: 'apple-touch-icon', sizes: '152x152', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-152x152.png` },
      { rel: 'apple-touch-icon', sizes: '180x180', href: `${process.env.BASE_URL || ''}/img/favicon/apple-icon-180x180.png` },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${process.env.BASE_URL || ''}/img/favicon/android-icon-192x192.png` },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${process.env.BASE_URL || ''}/img/favicon/favicon-32x32.png` },
      { rel: 'icon', type: 'image/png', sizes: '96x96', href: `${process.env.BASE_URL || ''}/img/favicon/favicon-96x96.png` },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${process.env.BASE_URL || ''}/img/favicon/favicon-16x16.png` },
    ]
  },
  loading: {
    color: '#0f111b',
    throttle: 0,
  },
  css: [],
  plugins: [
    { src: `~plugins/feather.js`, ssr: false },
  ],
  buildModules: [],
  modules: [
    '@nuxtjs/style-resources',
  ],
  styleResources: {
    sass: ['~assets/sass/global.sass']
  },
  build: {
    vendor: [],
    postcss: {
      preset: {
        features: {
          customProperties: false
        }
      }
    },
    transpile: [
      "gsap"
    ],
    extend (config, ctx) {
    }
  }
}
