/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Local design previews use the existing subscriber service when Resend
    // credentials are absent. Production always handles signups locally.
    const useHostedSignup =
      process.env.NODE_ENV === "development" &&
      (!process.env.RESEND_API_KEY || !process.env.RESEND_SEGMENT_ID)

    return {
      beforeFiles: useHostedSignup
        ? [{
            source: "/api/subscribe",
            destination: "https://www.kevingeorge.xyz/api/subscribe",
          }]
        : [],
    }
  },
}

export default nextConfig
