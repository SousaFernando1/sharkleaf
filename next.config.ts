import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite acesso pelo IP da rede local (celular na mesma rede Wi-Fi)
  allowedDevOrigins: ["192.168.0.102", "192.168.64.1"],
};

export default nextConfig;
