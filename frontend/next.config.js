/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  i18n: {
    // https://nextjs.org/docs/advanced-features/i18n-routing
    locales: ['en-GB'],
    defaultLocale: 'en-GB',
  },
  async redirects() {
    return [
      {
        source: '/poll',
        destination: '/',
        permanent: true,
      },
    ]
  },
  env: {
    API_BASEURL: process.env.API_BASEURL,
    NEXT_PUBLIC_API_BASEURL: process.env.NEXT_PUBLIC_API_BASEURL,
  },
}
