import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './App.{js,ts,vue}',
    './app.{js,ts,vue}',
    './Error.{js,ts,vue}',
    './error.{js,ts,vue}',
    './app.config.{js,ts}',
  ],

  theme: {
    screens: {
      'xs': '448px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },

    fontFamily: {
      sans: ['Faustina'],
    },

    extend: {
      spacing: {
        // containers
        'container': '2.5rem',
        'container-half': '1.25rem',
        'container-desktop': '6.25rem',
        'container-desktop-half': '3.125rem',
      },

      flexGrow: {
        0.5: '0.5',
        2: '2',
      },

      borderWidth: {
        1.5: '1.5px',
        2: '2px',
        3: '0.2rem',
        4: '0.4rem',
        5: '0.8rem',
      },
    },
  },

} satisfies Config
