/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    console.log(process.env.COURSE_URL);
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.AUTH_URL}/:path*`,
      },
      {
        source: "/api/course/:path*",
        destination: `${process.env.COURSE_URL}/:path*`,
      },
      {
        source: "/api/enrollment/:path*",
        destination: `${process.env.ENROLLMENT_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
