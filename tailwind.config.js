/** @type {import('tailwindcss').Config} */

const decanter = require('decanter');

const path = require('path');
const dir = path.resolve(__dirname, 'src/styles');

let twoColumn = {}, threeColumn = {}, i;
for (i = 1; i <= 4; i++) {
  twoColumn[`1-${i}`] = `minmax(0, 1fr) minmax(0, ${i}fr)`;
  twoColumn[`${i}-1`] = `minmax(0, ${i}fr) minmax(0, 1fr)`;
}

for (i = 1; i <= 4; i++) {
  threeColumn[`${i}-1-1`] = `minmax(0, ${i}fr) minmax(0, 1fr) minmax(0, 1fr)`;
  threeColumn[`1-${i}-1`] = `minmax(0, 1fr) minmax(0, ${i}fr) minmax(0, 1fr)`;
  threeColumn[`1-1-${i}`] = `minmax(0, 1fr) minmax(0, 1fr) minmax(0, ${i}fr)`;
}

module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    "max-w-prose",
    "mb-2",
    "mb-3",
    "mb-4",
    "pl-10",
    "pl-20",
    "pr-10",
    "pr-5",
    "pr-7",
    "text-sm",
  ],
  theme: {
    fontFamily: decanter.theme.fontFamily,
    decanter: decanter.theme.decanter,
    screens: decanter.theme.screens,
    extend: {
      ...decanter.theme.extend,
      screens: {
        "3xl": "1600px",
        "4xl": "1800px",
      },
      gridTemplateColumns: {...twoColumn, ...threeColumn},
      containers: {
        '9xl': '90rem',
        '10xl': '100rem',
        '11xl': '110rem',
        '12xl': '120rem',
        '13xl': '130rem',
        '14xl': '140rem',
        '15xl': '150rem',
      },
      scale: {
        '-100': '-1',
      },
      colors: {
        ...decanter.theme.extend.colors,
        'press-indigo': '#003D69',
        'press-grass': {
          DEFAULT: '#00593e',
          light: "#6FA287"
        },
        'press-bay': {
          DEFAULT: "#6FA287",
          light: '#a0d2bf',
          dark: "#417865",
        },
        'press-sand': {
          DEFAULT: '#9c9286',
          light: "#C5BEB2",
          dark: '#786E63',
        },
      },
    },
  },
  plugins: [
    ...decanter.plugins,
    require('@tailwindcss/container-queries'),
    require(`${dir}/typography/local-footer.tsx`)(),
    require(`${dir}/typography/global-message.tsx`)(),
    require(`${dir}/typography/wysiwyg.tsx`)(),
    require(`${dir}/centered-container.tsx`)(),
  ],
};
