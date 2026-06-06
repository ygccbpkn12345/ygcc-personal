import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          teal: '#35bfab',
          blue: '#1fc9e7',
        },
        text: {
          primary: '#334f52',
          secondary: '#7b888e',
        },
        bg: {
          page: '#eeeeee',
          card: 'rgba(255, 255, 255, 0.4)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'monospace',
        ],
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}
export default config
