/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: 'rgba(19, 136, 8, 0.08)',
          100: 'rgba(19, 136, 8, 0.15)',
          200: 'rgba(19, 136, 8, 0.25)',
          300: 'rgba(19, 136, 8, 0.4)',
          400: 'var(--india-green)',
          500: 'var(--india-green)',
          600: 'var(--primary-navy)',
          700: 'var(--primary-navy)',
          800: 'var(--primary-navy)',
          900: 'var(--primary-navy)',
          950: 'var(--bg-color)',
        },
        charcoal: {
          50: 'var(--bg-color)',
          100: 'var(--surface-secondary)',
          200: 'var(--border-color)',
          300: 'var(--text-muted)',
          400: 'var(--text-muted)',
          500: 'var(--text-muted)',
          600: 'var(--text-muted)',
          700: 'var(--border-color)',
          800: 'var(--border-color)',
          900: 'var(--text-main)',
          950: 'var(--bg-color)',
        },
        gold: {
          50: 'rgba(255, 153, 51, 0.08)',
          100: 'rgba(255, 153, 51, 0.15)',
          200: 'rgba(255, 153, 51, 0.25)',
          300: 'var(--saffron-accent)',
          400: 'var(--saffron-accent)',
          500: 'var(--saffron-accent)',
          600: 'var(--saffron-accent)',
          700: 'var(--saffron-accent)',
          800: 'var(--saffron-accent)',
          900: 'var(--saffron-accent)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-soft': 'bounceSoft 1s ease-in-out infinite',
        'gradient-x': 'gradientX 5s ease infinite',
        'tilt': 'tilt 10s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'pop': 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        tilt: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(1deg)' },
          '75%': { transform: 'rotate(-1deg)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
