module.exports = {
  i18n: {
    locales: ['sv'],
    defaultLocale: 'sv',
  },
  images: {
    domains: ['cdn.sanity.io'],
  },
  rewrites: async () =>
    process.env.NODE_ENV === 'development'
      ? [
          {
            source: '/studio/:path*',
            destination: 'http://localhost:3333/studio/:path*',
          },
          {
            source: '/__webpack_hmr',
            destination: 'http://localhost:3333/__webpack_hmr',
          },
        ]
      : [
          {
            source: '/studio/:path*',
            destination: '/studio/index.html',
          },
        ],
};
