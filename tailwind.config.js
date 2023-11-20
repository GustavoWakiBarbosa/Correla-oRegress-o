const defaultTheme = require('tailwindcss/defaultTheme')
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Fira Sans',
          ...defaultTheme.fontFamily.sans
        ]
      },
      fontSize: {
        'ett-display-3xl': ['4.5rem', '1.3'],
        'ett-display-2xl': ['4rem', '1.3'],
        'ett-display-lg': ['3.5rem', '1.3'],
        'ett-display-md': ['2.8125rem', '1.3'],
        'ett-display-sm': ['2.25rem', '1.3'],
        'ett-headline-lg': ['2rem', '1.5'],
        'ett-headline-md': ['1.75rem', '1.5'],
        'ett-headline-sm': ['1.5rem', '1.5'],
        'ett-title-lg': ['1.375rem', '1.5'],
        'ett-title-md': ['1rem', '1.5'],
        'ett-title-sm': ['0.875rem', '1.5'],
        'ett-title-esm': ['0.6875rem', '1.5'],
        'ett-label-lg': ['1.5rem', '1.5'],
        'ett-label-md': ['1.25rem', '1.5'],
        'ett-label-sm': ['1rem', '1.5'],
        'ett-body-lg': ['1.5rem', '1.5'],
        'ett-body-md': ['1.25rem', '1.5'],
        'ett-body-sm': ['1rem', '1.5'],
      },
      colors: {
        'ett-primary': { 
          50: '#e9ebfd',
          100: '#bac2f9',
          200: '#98a4f6',
          300: '#6a7bf2',
          400: '#4d61f0',
          500: '#203aec',
          600: '#1d35d7',
          700: '#1729a8',
          800: '#122082',
          900: '#0d1863 '
        },
        'ett-secondary': {
          50: '#e9e9e9',
          100: '#bbbaba',
          200: '#9a9898',
          300: '#6c696a',
          400: '#4f4c4d',
          500: '#231f20',
          600: '#201c1d',
          700: '#191617',
          800: '#131112',
          900: '#0f0d0d '
        },
        'ett-neutrals': {
          50: '#fefefe',
          100: '#fbfbfb',
          200: '#f9f9f9',
          300: '#f6f6f6',
          400: '#f4f4f5',
          500: '#f1f1f2',
          600: '#dbdbdc',
          700: '#ababac',
          800: '#858585',
          900: '#656566' 
        },
        'ett-green': {
          50: '#f2f9e9',
          100: '#d8ebbb',
          200: '#c5e29b',
          300: '#abd56d',
          400: '#9acd51',
          500: '#81c025',
          600: '#75af22',
          700: '#5c881a',
          800: '#476a14',
          900: '#365110'
        },
        'ett-warning': {
          50: '#fef4ea',
          100: '#fddebf',
          200: '#fccea0',
          300: '#fab874',
          400: '#f9aa59',
          500: '#f89530',
          600: '#e2882c',
          700: '#b06a22',
          800: '#88521a',
          900: '#683f14'
        },
        'ett-error': {
          50: '#fbeaec',
          100: '#f3bdc3',
          200: '#ee9da5',
          300: '#e6717c',
          400: '#e15563',
          500: '#d92b3c',
          600: '#c52737',
          700: '#9a1f2b',
          800: '#771821',
          900: '#5b1219'
        }
      },
      backgroundImage: {
        waves: "url('./src/assets/grafismos/waves.svg')",
        'waves-short': "url('./src/assets/grafismos/waves-short.svg')",
        'waves-no-padding': "url('./src/assets/grafismos/wave-no-padding.svg')"
      }
    },
    container: {
      center: true
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwindcss-animated'),
    require('daisyui'),
    plugin(function({ addVariant }) {
      addVariant(
        'supports-backdrop-blur',
        '@supports (backdrop-filter: blur(0)) or (-webkit-backdrop-filter: blur(0))'
      )
    })
  ],
  daisyui: {
    themes: [
      {
        'ett': {
          'primary': '#2a4ddd',
          'primary-focus': '#2d56fb',
          'primary-content': '#ffffff',
          'secondary': '#ffcf64',
          'secondary-focus': '#bd0091',
          'secondary-content': '#ffffff',
          'accent': '#ffcf64',
          'accent-focus': '#fdc449',
          'accent-content': '#ffffff',
          'neutral': '#3b3f51',
          'neutral-focus': '#2a2e37',
          'neutral-content': '#ffffff',
          'base-100': '#ffffff',
          'base-200': '#f9fafb',
          'base-300': '#d1d5db',
          'base-content': '#3c3e45',
          'info': '#2094f3',
          'success': '#81c025',
          'warning': '#f89530',
          'error': '#d92b3c',
        },
      },
    ],
  },
}
