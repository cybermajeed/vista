/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: "#FDE68A", // soft pastel yellow
          "yellow-deep": "#D97706",
          accent: "#B45309", // replaces blue, strong amber for contrast
          coral: "#FECACA",
          rose: "#FCE7F3",
          teal: "#CCFBF1",
          pink: "#FBCFE8",
          "orange-light": "#FFEDD5",
          red: "#FCA5A5",
          "red-dark": "#DC2626",
        },
        primary: "#2C2A29", // softer dark charcoal instead of bold black/navy
        "on-primary": "#FAFAF9",
        yellow: {
          light: "#FEF9C3",
          dark: "#854D0E", // ensure text on light yellow has contrast
        },
        accent: {
          pressed: "#92400E",
        },
        coral: {
          light: "#FEF2F2",
          dark: "#991B1B",
        },
        teal: {
          light: "#F0FDFA",
        },
        moss: {
          dark: "#115E59",
        },
        canvas: "#FFFFFF",
        surface: {
          DEFAULT: "#F5F5F4",
          soft: "#FAFAF9",
          yellow: "#FEF9C3",
          "pricing-featured": "#FEF3C7", // warm amber-100 background for featured elements
        },
        hairline: {
          DEFAULT: "#E7E5E4",
          soft: "#F5F5F4",
          strong: "#D6D3D1",
        },
        ink: {
          deep: "#1C1917",
          DEFAULT: "#292524",
        },
        charcoal: "#44403C",
        slate: "#78716C",
        steel: "#A8A29E",
        stone: "#D6D3D1",
        muted: "#E7E5E4",
        "on-dark": {
          DEFAULT: "#FFFFFF",
          muted: "rgba(255, 255, 255, 0.7)",
        },
        "success-accent": "#059669",
        "footer-bg": "#1C1917",
      },
      fontFamily: {
        sans: [
          '"Montserrat"',
          '"Inter"',
          '"Noto Sans"',
          "-apple-system",
          "BlinkMacSystemFont",
          "sans-serif",
        ],
        serif: [
          '"Cormorant Garamond"',
          '"Playfair Display"',
          'Georgia',
          'serif',
        ]
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        xxl: "20px",
        xxxl: "28px",
        feature: "32px",
        full: "9999px",
      },
      spacing: {
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "20px",
        xl: "24px",
        xxl: "32px",
        xxxl: "40px",
        "section-sm": "48px",
        section: "64px",
        "section-lg": "96px",
        hero: "120px",
      },
      boxShadow: {
        1: "0px 1px 2px 0px rgba(44, 42, 41, 0.04)",
        2: "0px 4px 12px 0px rgba(44, 42, 41, 0.06)",
        3: "0px 12px 32px -4px rgba(44, 42, 41, 0.08)",
        4: "0px 16px 48px -8px rgba(44, 42, 41, 0.12)",
      },
    },
  },
  plugins: [],
};
