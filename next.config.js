/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com'],
      },
      webpack: (config, { isServer }) => {
        config.module.rules.push({
          test: /\.(mp3)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                publicPath: '/_next',
                name: 'static/media/[name].[hash].[ext]',
              },
            },
          ],
        });
    
        return config;
      },
      future: {
        webpack5: true,
      },
      env: {
        NEXT_PUBLIC_JWT_SECRET: process.env.NEXT_PUBLIC_JWT_SECRET,
      }
      
}

module.exports = nextConfig
