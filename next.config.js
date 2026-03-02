/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/courses-react',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
