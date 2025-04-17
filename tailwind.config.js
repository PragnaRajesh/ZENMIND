/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        softpulse: {
          '0%, 100%': { boxShadow: '0 0 0px rgba(236, 72, 153, 0.4)' },
          '50%': { boxShadow: '0 0 12px rgba(236, 72, 153, 0.6)' },
        },
        blink: {
          '0%, 97%, 100%': { opacity: '1' },
          '98%, 99%': { opacity: '0.3' },
        },
        fadein: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        }
      },
      
      animation: {
        softpulse: 'softpulse 3s ease-in-out infinite',
        blink: 'blink 5s ease-in-out infinite',
        fadein: 'fadein 0.6s ease-out forwards',
      }
    }
  },
  plugins: [],
};
