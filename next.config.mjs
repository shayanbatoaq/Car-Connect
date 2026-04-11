import { fileURLToPath } from "node:url";
import path from "node:path";

const nextConfig = {
  outputFileTracingRoot: path.dirname(fileURLToPath(import.meta.url)),
}

export default nextConfig
