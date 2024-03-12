/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_URL}/:path*`,
      },
      {
        source: "/api/course/:path*",
        destination: `${process.env.NEXT_PUBLIC_COURSE_URL}/:path*`,
      },
      {
        source: "/api/enrollment/:path*",
        destination: `${process.env.NEXT_PUBLIC_ENROLLMENT_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
