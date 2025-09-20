/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f5ff',
          yellow: '#ffff00',
          green: '#00ff00',
          purple: '#ff00ff',
          pink: '#ff1493',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#1a1a1a',
          border: '#333333',
        }
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '100%': { 
            boxShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
          },
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}


