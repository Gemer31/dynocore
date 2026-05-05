/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: '#080B10',
        graphite: '#111827',
        steel: '#1E3A5F',
        blue: '#2F80ED',
        gold: '#C8A96A',
        text: '#E5E7EB',
        muted: '#9CA3AF',
        success: '#22C55E'
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace']
      },
      boxShadow: {
        glow: '0 0 40px rgba(47, 128, 237, 0.18)',
        gold: '0 0 32px rgba(200, 169, 106, 0.16)'
      }
    }
  },
  plugins: []
};
