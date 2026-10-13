import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/~AD0181/",

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["moosic.png"],
      manifest: {
        id: "/~AD0181/",
        name: "Moosic",
        short_name: "Moosic",
        theme_color: "#ff69b4",
        display: "standalone",
        start_url: "/~AD0181/",
        icons: [
          {
            src: "/~AD0181/moosic.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/~AD0181/moosic.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
          },
          {
            urlPattern: ({ request }) =>
              request.destination === "script" ||
              request.destination === "style",
            handler: "CacheFirst",
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
          },
        ],
      },
    }),
  ],
});