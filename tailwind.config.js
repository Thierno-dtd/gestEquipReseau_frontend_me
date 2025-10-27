/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#1193d4',
          'background-light': '#f6f7f8',
          'background-dark': '#101c22',
          'surface-dark': '#1a2831',
          'text-dark-primary': '#e1e3e4',
          'text-dark-secondary': '#99a1a6',
        },
        fontFamily: {
          display: ['Manrope', 'sans-serif'],
        },
        borderRadius: {
          DEFAULT: '0.5rem',
          lg: '0.75rem',
          xl: '1rem',
          full: '9999px',
        },
      },
    },
    plugins: [
      require('@tailwindcss/forms'),
      require('@tailwindcss/container-queries'),
    ],
  }
  