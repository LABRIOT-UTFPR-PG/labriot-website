/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "base-uri 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
              "form-action 'self'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "style-src 'self' 'unsafe-inline' https://*.hcaptcha.com",
              `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV !== "production" ? " 'unsafe-eval'" : ""} https://*.hcaptcha.com`,
              "connect-src 'self' https://*.hcaptcha.com https://api.web3forms.com",
              "frame-src https://app.roboflow.com https://*.hcaptcha.com",
              "media-src 'self' blob:",
              "worker-src 'self' blob:",
            ].join("; "),
          },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              'camera=(self "https://app.roboflow.com"), microphone=(self "https://app.roboflow.com"), geolocation=(), payment=(), usb=(), fullscreen=(self "https://app.roboflow.com")',
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
