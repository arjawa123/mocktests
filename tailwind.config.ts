import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px"
      }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))"
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))"
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))"
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        soft: "0 12px 28px -16px rgba(2, 6, 23, 0.35)",
        lift: "0 24px 50px -24px rgba(2, 6, 23, 0.4)",
        glow: "0 0 0 1px rgba(99, 102, 241, 0.08), 0 18px 40px -24px rgba(99, 102, 241, 0.5)"
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(65rem 36rem at -10% -20%, rgba(56, 189, 248, 0.22), transparent 56%), radial-gradient(52rem 28rem at 115% -18%, rgba(14, 165, 233, 0.2), transparent 58%), linear-gradient(120deg, rgba(2, 6, 23, 0.96) 0%, rgba(15, 23, 42, 0.96) 100%)",
        "card-gradient":
          "linear-gradient(155deg, rgba(255,255,255,0.92) 0%, rgba(248,250,252,0.86) 45%, rgba(239,246,255,0.9) 100%)"
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "pulse-soft": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.95" },
          "50%": { transform: "scale(1.02)", opacity: "1" }
        }
      },
      animation: {
        "fade-in": "fade-in 500ms ease-out",
        "slide-up": "slide-up 500ms ease-out",
        "pulse-soft": "pulse-soft 2.5s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
