<<<<<<< HEAD:frontend/project-tracker/tailwind.config.js
/** @type {import('tailwindcss').Config} */
=======
>>>>>>> d0383da1e1949c2e9dd07bad69ef9006ff32aac9:frontend/tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
<<<<<<< HEAD:frontend/project-tracker/tailwind.config.js
    extend: {},
  },
  plugins: [],
}

=======
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
>>>>>>> d0383da1e1949c2e9dd07bad69ef9006ff32aac9:frontend/tailwind.config.js
