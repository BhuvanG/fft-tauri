/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        'newGrid': '0.8fr 2fr 2fr 2fr 2fr 2fr 2fr',
      }
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["cyberpunk", "synthwave", "dark", "dracula", "halloween", "luxury", "forest", "christmas"]
  }
}

