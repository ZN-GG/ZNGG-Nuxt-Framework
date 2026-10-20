import typography from '@tailwindcss/typography'
import animate from 'tailwindcss-animate'

export default {
  darkMode: 'class',
  mode: 'jit',
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/plugins/**/*.{js,ts}',
    './app/composables/**/*.{js,ts}',
    './app/utils/**/*.{js,ts}',
    './app/config/**/*.{js,ts}',
  ],
  theme: {
    container: {
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '2.5rem',
        xl: '3rem',
        '2xl': '3rem',
      },
    },
    extend: {
      colors: {
        blue: {
          50: '#E8F3FF',
          100: '#D9E8FF',
          200: '#B7D4FF',
          300: '#8BBBFF',
          400: '#5A9BFF',
          500: '#4080FF',
          600: '#165DFF',
          700: '#0E42D2',
          800: '#0A2FA0',
          900: '#07206E',
        },
        canvas: 'hsl(var(--canvas) / <alpha-value>)',
        surface: 'hsl(var(--surface) / <alpha-value>)',
        'surface-muted': 'hsl(var(--surface-muted) / <alpha-value>)',
        ink: 'hsl(var(--ink) / <alpha-value>)',
        muted: 'hsl(var(--muted) / <alpha-value>)',
        line: 'hsl(var(--line) / <alpha-value>)',
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          strong: 'hsl(var(--accent-strong) / <alpha-value>)',
          soft: 'hsl(var(--accent-soft) / <alpha-value>)',
        },
        info: 'hsl(var(--info) / <alpha-value>)',
        success: 'hsl(var(--success) / <alpha-value>)',
        warning: 'hsl(var(--warning) / <alpha-value>)',
        danger: 'hsl(var(--danger) / <alpha-value>)',
      },
      fontFamily: {
        sans: [
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'Noto Sans SC',
          'sans-serif',
        ],
        mono: ['Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '4px',
        control: '2px',
        md: '4px',
        lg: '4px',
        xl: '4px',
        '2xl': '4px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        pop: 'var(--shadow-pop)',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 160ms ease-out both',
        'slide-up': 'slide-up 180ms ease-out both',
      },
    },
  },
  plugins: [
    typography,
    animate,
    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': { maxWidth: '640px' },
          '@screen md': { maxWidth: '768px' },
          '@screen lg': { maxWidth: '1200px' },
          '@screen xl': { maxWidth: '1200px' },
          '@screen 2xl': { maxWidth: '1200px' },
        },
      })
    },
  ],
}
