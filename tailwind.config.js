module.exports = {
  mode: 'jit',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    extend: {
      screens: {
        'xs': '360px',
        'nav': '600px'
      },
      fontFamily: {
        'poppins': 'Poppins',
        'saira': 'Saira',
        'saira-el': 'saira-el',
        'saira-l': 'saira-l',
        'saira-m': 'saira-m',
        'saira-sb': 'saira-sb',
        'saira-b': 'saira-b',
        'saira-eb': 'saira-eb',
        'saira-black': 'saira-black'
      },
      colors: {
        primary: '#E63946',
        secondary: '#FFB703',
        altBlue: '#1481BA',
        altCyan: '#59C3C3',
        button: '#519A63',
        gray: {
          900: '#202225',
          800: '#2f3136'
        },
      }
    }
  },
  
  plugins: [],
}