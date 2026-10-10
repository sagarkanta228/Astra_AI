/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Snapshot 1 Cyber Gold Palette
        "primary-gold": "#F59E0B",
        "primary-dark": "#D97706",
        "primary-glow": "#F5A623",
        "on-primary": "#08080A",
        "surface-darkest": "#050608",
        "surface-dark": "#08080A",
        "surface-card": "#0D0F14",
        "surface-card-hover": "#13171F",
        "surface-card-border": "#1F2430",
        "surface-field": "#07080B",
        "border-subtle": "rgba(245, 158, 11, 0.18)",
        "text-muted": "#94A3B8",
        "text-subtle": "#64748B",

        // Snapshot 2 Enterprise Dashboard Palette
        "tertiary": "#fcb973",
        "secondary-container": "#bf4502",
        "error": "#ffb4ab",
        "on-surface": "#e2e2eb",
        "surface-container-lowest": "#0c0e14",
        "surface-container-low": "#191b22",
        "surface-container": "#1e1f26",
        "surface-container-high": "#282a30",
        "surface-container-highest": "#33343b",
        "primary-container": "#f66018",
        "outline": "#a98a7e",
        "surface": "#111319",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        heading: ["Space Grotesk", "sans-serif"],
      },
      spacing: {
        "space-xs": "0.25rem",
        "space-sm": "0.5rem",
        "space-md": "1rem",
        "space-lg": "1.5rem",
        "space-xl": "2.5rem",
        "gutter": "1.5rem",
      }
    },
  },
  plugins: [],
}
