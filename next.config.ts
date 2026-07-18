import type { NextConfig } from "next";

type ImageRemotePattern = NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
>[number];

function getSupabaseImageRemotePattern(): ImageRemotePattern | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return null;
  }

  try {
    const url = new URL(supabaseUrl);

    return {
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname: "/storage/v1/object/public/recipe-images/**"
    };
  } catch {
    return null;
  }
}

const supabaseImageRemotePattern = getSupabaseImageRemotePattern();
const recipeImageRemotePatterns: ImageRemotePattern[] = [
  {
    protocol: "http",
    hostname: "127.0.0.1",
    port: "54321",
    pathname: "/storage/v1/object/public/recipe-images/**"
  },
  {
    protocol: "http",
    hostname: "localhost",
    port: "54321",
    pathname: "/storage/v1/object/public/recipe-images/**"
  },
  {
    protocol: "https",
    hostname: "**.supabase.co",
    pathname: "/storage/v1/object/public/recipe-images/**"
  }
];

if (supabaseImageRemotePattern) {
  recipeImageRemotePatterns.push(supabaseImageRemotePattern);
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production",
    remotePatterns: recipeImageRemotePatterns
  }
};

export default nextConfig;
