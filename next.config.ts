import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  // Tell Next.js server bundler to never try to bundle firebase packages.
  // Firebase is a client-only SDK and must never be imported on the server.
  serverExternalPackages: [
    'firebase',
    'firebase/app',
    'firebase/auth',
    'firebase/firestore',
    'firebase/storage',
    '@firebase/app',
    '@firebase/auth',
    '@firebase/firestore',
    'genkit',
    '@genkit-ai/core',
    'yaml',
    'dotprompt',
  ],
  turbopack: {
    root: process.cwd(),
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
