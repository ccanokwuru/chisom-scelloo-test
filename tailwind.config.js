/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neutral: '#f2f0f9',
        primary: '#6d5bd0',
        'primary-dark': '#25213b',
        'primary-light': '#6e6893',
        'primary-light-2': '#8b83ba',
        info: '#4a4aff',
        'info-neutral': '#e6e6f2',
        positive: '#007f00',
        'positive-neutral': '#cdffcd',
        negative: '#d30000',
        'negative-neutral': '#ffe0e0',
        warning: '#965e00',
        'warning-1': '#ce8500',
        'warning-neutral': '#ffeccc'
      }
    }
  },
  plugins: []
}
