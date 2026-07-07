import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactStrictMode: true,
    typedRoutes: true,
    reactCompiler: true,
    cacheComponents: true,
    experimental: {
        viewTransition: true,
    },
};

export default nextConfig;
