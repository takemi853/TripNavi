/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      bodyParser: {
        sizeLimit: '1mb', // 必要に応じてサイズ制限を設定
      },
    },
  };
  
  export default nextConfig;
  