import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        green: {
          DEFAULT: "#00C853",
          light: "#69F0AE",
          dark: "#00952F",
        },
        // Dark palette
        bg: {
          DEFAULT: "#080B0F",
          surface: "#0E1318",
          elevated: "#141B22",
          border: "#1E2A35",
          hover: "#1A2430",
        },
        // Text
        text: {
          primary: "#F0F4F8",
          secondary: "#8A9BB0",
          muted: "#4A5A6A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-in-left": "slideInLeft 0.6s ease forwards",
        "slide-in-right": "slideInRight 0.6s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "scan-line": "scanLine 4s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "border-rotate": "borderRotate 4s linear infinite",
        "counter": "counter 2s ease forwards",
        typewriter: "typewriter 3s steps(40) forwards",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(40px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px 0 rgba(0, 200, 83, 0.2)" },
          "50%": { boxShadow: "0 0 40px 8px rgba(0, 200, 83, 0.4)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        borderRotate: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        typewriter: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        blink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#00C853" },
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(0,200,83,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,200,83,0.03) 1px, transparent 1px)",
        "dot-pattern":
          "radial-gradient(circle, rgba(0,200,83,0.15) 1px, transparent 1px)",
        "green-glow":
          "radial-gradient(circle at center, rgba(0,200,83,0.15) 0%, transparent 70%)",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,200,83,0.12) 0%, transparent 60%)",
      },
      backgroundSize: {
        "grid": "60px 60px",
        "dot": "24px 24px",
      },
      boxShadow: {
        "green-sm": "0 0 10px rgba(0,200,83,0.2)",
        "green-md": "0 0 20px rgba(0,200,83,0.3)",
        "green-lg": "0 0 40px rgba(0,200,83,0.3)",
        "card": "0 4px 24px rgba(0,0,0,0.4)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(0,200,83,0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
