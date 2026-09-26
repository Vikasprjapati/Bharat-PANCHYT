/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1F3A",
          deep: "#102A43",
          light: "#1C3D5A",
          muted: "#334E68"
        },
        teal: {
          DEFAULT: "#087F73",
          dark: "#055951",
          light: "#20A396",
          subtle: "#E6F6F4"
        },
        green: {
          accent: "#159A6B",
          light: "#E3F7EE"
        },
        saffron: {
          DEFAULT: "#F28C28",
          dark: "#C66908",
          light: "#FFF3E6"
        },
        canvas: "#F8FAFC",
        surface: "#FFFFFF",
        surfaceAlt: "#F1F5F9",
        borderMuted: "#E2E8F0",
        charcoal: "#1F2937"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
