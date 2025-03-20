import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        ppr: true,
        reactCompiler: true,
        dynamicIO: true,
    },
    serverExternalPackages: [
        "@react-email/components",
        "@react-email/tailwind",
    ],
};

export default nextConfig;
