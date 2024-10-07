import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Permet l'accès depuis n'importe quel appareil du réseau
    port: 5173, // Assurez-vous que le port est bien 5173
  },
});
