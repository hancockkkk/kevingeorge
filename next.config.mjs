/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    // Local design previews use the existing subscriber service when database
    // credentials are absent. Production always handles signups locally.
    const useHostedSignup =
      process.env.NODE_ENV === "development" &&
      (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY)

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
