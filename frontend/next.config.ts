import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    // TODO: NAS 배포 후 이미지 서버 URL로 교체하세요.
    // 예) NAS에서 Nginx로 /uploads 를 서빙한다면:
    //   { protocol: "http", hostname: "192.168.1.x", pathname: "/uploads/**" }
    // 이미지를 /public 폴더에 직접 넣어 쓴다면 remotePatterns 불필요.
    remotePatterns: [],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/ko",
        permanent: false,
      },
      {
        source: "/~ykim",
        destination: "/ko/members/~ykim",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
