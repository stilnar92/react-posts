/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // User avatar colors from UI requirements
        'user-1': '#3B82F6',  // Blue
        'user-2': '#10B981',  // Green  
        'user-3': '#F59E0B',  // Yellow
        'user-4': '#8B5CF6',  // Purple
        'user-5': '#EC4899',  // Pink
        'user-6': '#EF4444',  // Red
        'user-7': '#06B6D4',  // Cyan
        'user-8': '#84CC16',  // Lime
        'user-9': '#F97316',  // Orange
        'user-10': '#8B5CF6', // Purple (fallback)
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      fontSize: {
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],      // 40px
        'h2': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],   // 18px  
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],    // 20px
      },
      spacing: {
        '18': '4.5rem', // 72px - for header spacing
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'scale-in': 'scaleIn 200ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
} 