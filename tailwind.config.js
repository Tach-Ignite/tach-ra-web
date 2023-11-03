/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        '2xl': '1700px',
        '3xl': '1980px',
        '4xl': '2560px',
      },
      backgroundImage: {},
      colors: {
        tachPurple: '#33edf5',
        tachLight: '#f5f5f5',
        tachGrey: '#888',
        // darkBlue: '#0f1954',
        tachDark: '#222',
        lightBlue: '#45519a',
        tachLime: '#aada33',
        tachPurple: '#c263bd',
        tachDarkPurple: '#a2439d',
        tachGreen: '#6ebf58',
      },
      fontFamily: {
        bodyFont: ['Poppins', 'sans-serif'],
      },
    },
  },
  darkMode: 'class',
  variants: {
    extend: {
      backgroundImage: ['dark'],
    },
  },

  plugins: [],
};
