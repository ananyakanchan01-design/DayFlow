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
        dayflow: {
          bg: '#FFF9F3',
          'bg-dark': '#182127',
          surface: '#FFFFFF',
          'surface-dark': '#202B31',
          'surface-muted': '#F8F4EE',
          'surface-muted-dark': '#25323A',
          text: '#24313A',
          'text-muted': '#6B7A85',
          'text-dark': '#F7F3EC',
          'text-muted-dark': '#9CAAB5',
          coral: '#FFB6A6',
          'coral-hover': '#FF9F8C',
          cream: '#FFEBD3',
          mint: '#9BCEC1',
          'mint-dark': '#7CB5A6',
          blue: '#67A2C5',
          'blue-dark': '#4D8AA8',
          border: '#EFE7DC',
          'border-dark': '#2F3D47',
          sage: '#8FA58A',
          peach: '#E9B8A8',
          beige: '#E7DFD2',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 8px 30px rgba(36, 49, 58, 0.05)',
        'soft-lg': '0 16px 40px rgba(36, 49, 58, 0.08)',
        'clay': '0 12px 24px -6px rgba(36, 49, 58, 0.08), inset 0 2px 4px rgba(255, 255, 255, 0.8)',
        'clay-sm': '0 4px 12px -2px rgba(36, 49, 58, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.6)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
