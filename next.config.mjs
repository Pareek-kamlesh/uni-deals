/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable caching for all API routes
    headers: async () => {
      return [
        {
          source: '/api/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'no-store, max-age=0',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;