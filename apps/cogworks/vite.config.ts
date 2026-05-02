import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Proxy target when running `bun dev`. Reads VITE_API_URL from .env / .env.local
// so the ninsys-api can live on any host/port locally. Defaults to the
// conventional local port if the var is unset.
const DEFAULT_DEV_API_URL = "http://localhost:3001";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");
	const apiUrl = env.VITE_API_URL || DEFAULT_DEV_API_URL;

	return {
		plugins: [react(), tailwindcss(), tsconfigPaths()],
		server: {
			port: 3000,
			open: true,
			proxy: {
				"/v2/cogworks": {
					target: apiUrl,
					changeOrigin: true,
				},
			},
		},
		build: {
			outDir: "dist",
			sourcemap: false,
			minify: "esbuild",
		},
	};
});
