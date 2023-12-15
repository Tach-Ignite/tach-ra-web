const fs = require('fs');
const dotenv = require('dotenv');
let tc = require('./tach.config');

if (fs.existsSync('./tach.config.local.js')) {
  tc = require('./tach.config.local');
}

let rawSecrets = {};
let secrets = '{}';
if (
  tc.secrets.provider === 'env' &&
  process.env.NODE_ENV !== 'production' &&
  fs.existsSync(`./.env.secrets.local`)
) {
  const f = fs.readFileSync(`./.env.secrets.local`);
  rawSecrets = dotenv.parse(f);
  secrets = JSON.stringify(rawSecrets);
}
process.env.secrets = secrets;

const headers = [
  'Accept',
  'Accept-Version',
  'Content-Length',
  'Content-MD5',
  'Content-Type',
  'Date',
  'X-Api-Version',
  'X-CSRF-Token',
  'X-Requested-With',
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'tach.config.local': false,
    };
    return config;
  },
  env: {
    secrets: process.env.secrets,
    ALLOWED_NEXT_AUTH_URLS: [
      'https://(.+\\.|)localhost:3000/?',
      'https://(.+\\.|)localhost:3001/?',
    ],
    ALLOWED_HEADERS: headers.join(', '),
    CORS_DEFAULTS: {
      methods: [], // making this blank by default - you have to override it per-call
      origin: '*',
      allowedHeaders: headers.join(', '),
      credentials: true,
    },
  },
  async headers() {
    return [
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: headers.join(', '),
          },
        ],
      },
    ];
  },
  // async headers() {
  //   return [
  //     {
  //       // matching all API routes
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Access-Control-Allow-Credentials', value: 'true' },
  //         { key: 'Access-Control-Allow-Origin', value: '*' }, // replace this your actual origin
  //         {
  //           key: 'Access-Control-Allow-Methods',
  //           value: 'GET,DELETE,PATCH,POST,PUT',
  //         },
  //         {
  //           key: 'Access-Control-Allow-Headers',
  //           value:
  //             'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  //         },
  //       ],
  //     },
  //   ];
  // },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      `${process.env.TACH_AWS_BUCKET_NAME}.s3.${process.env.TACH_AWS_REGION}.amazonaws.com`,
      'tachignitelocal11335-local.s3.us-east-1.amazonaws.com',
      'example.s3.us-east-1.amazonaws.com',
      'avatars.githubusercontent.com',
      'picsum.photos',
      'localhost',
    ],
  },
};

module.exports = nextConfig;
