import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
// import fetchCache from "@fetch-cache/astro";
// @todo: dev mode
import fetchCache from "./workspaces/fetch-cache/packages/astro/src";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  integrations: [
    tailwind(),
    solidJs({
      devtools: true,
    }),
    {
      name: "jsoneditor",
      hooks: {
        "astro:config:setup": ({ injectScript }) => {
          // process.on("warning", (warning) => {
          //   console.log(warning.stack);
          // });
          injectScript(
            "before-hydration",
            `
					    import JSONEditor from "jsoneditor/dist/jsoneditor.min.js";
					    window.JSONEditor = JSONEditor;
					  `
          );
        },
      },
    },
    fetchCache({
      useRedis: false,
      debug: true,
      redis: {
        url: "redis://localhost:6379",
      },
    }),
  ],
  adapter: node({
    mode: "standalone",
  }),
});
