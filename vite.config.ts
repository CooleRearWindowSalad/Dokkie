import { defineConfig, loadEnv } from "vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { globSync } from "glob";

// ESM doesn't provide __filename/__dirname. Create them from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(config => {
    const env: Record<string, string> = loadEnv(config.mode, process.cwd(), "VITE");

    const processedEnvVars: Record<string, string> = Object.entries(env).reduce((prev: Record<string, string>, [key, val]) => {
        return {
            ...prev,
            [key.substring("VITE_".length)]: val,
        };
    }, {});


    let htmlFiles: string[];

    if (config.mode === "development") {
        htmlFiles = globSync("**/*.html", {
            cwd: resolve(__dirname, "./wwwroot"),
        });
    }
    else {
        htmlFiles = globSync("wwwroot/**/*.html", {
            cwd: resolve(__dirname, "./"),
        });
    }

    const input: {
        [key: string]: string;
    } = {};

    htmlFiles.forEach((e: string, i: number) => {
        if (config.mode === "development") {
            input[`app_${i}`] = resolve(__dirname, "./wwwroot", e);
        } else {
            input[`app_${i}`] = resolve(__dirname, e);
        }
    });

    return {
        base: "./",
        root: "wwwroot",
        appType: "mpa",
        resolve: {
            alias: {
                "/src": resolve(__dirname, "./src"),
            },
        },
        build: {
            sourcemap: true,
            rollupOptions: {
                input: input,
            },
            outDir: resolve(__dirname, "./dist"),
            emptyOutDir: true,
        },
        esbuild: {
            supported: {
                "top-level-await": true,
            },
        },
        plugins: [],
        define: {
            processedEnvVars: processedEnvVars,
        },
        server: {
            strictPort: true,
            port: 3000,
        },
        preview: {
            strictPort: true,
            port: 3000,
        },
    };
});