// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Premium Fitness Brand Colors
        primary: {
          50: '#fef6ee',
          100: '#fce9d3',
          200: '#f8d0a6',
          300: '#f3ad6d',
          400: '#ed8232',
          500: '#e8640f', // Burnt Orange (Primary)
          600: '#d94a05',
          700: '#b43607',
          800: '#902d0d',
          900: '#75270e',
        },
        dark: {
          50: '#f7f7f7',
          100: '#e3e3e3',
          200: '#c8c8c8',
          300: '#a4a4a4',
          400: '#818181',
          500: '#666666',
          600: '#515151',
          700: '#434343',
          800: '#2d2d2d', // Matte Black
          900: '#1a1a1a', // Deep Black
        },
        concrete: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#262626',
          900: '#1f2937',
        },
        metallic: {
          silver: '#c0c0c0',
          steel: '#71797E',
          iron: '#3d3d3d',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'Impact', 'sans-serif'],
        mono: ['var(--font-roboto-mono)', 'monospace'],
      },
      fontSize: {
        'display-lg': ['4.5rem', { lineHeight: '1', fontWeight: '900' }],
        'display-md': ['3.5rem', { lineHeight: '1.1', fontWeight: '900' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', fontWeight: '800' }],
      },
      backgroundImage: {
        'concrete-texture': "url('/textures/concrete.jpg')",
        'metal-texture': "url('/textures/metal.jpg')",
        'gym-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        'primary-gradient': 'linear-gradient(135deg, #e8640f 0%, #d94a05 100%)',
        'dark-gradient': 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
      },
      boxShadow: {
        'glow-orange': '0 0 20px rgba(232, 100, 15, 0.3)',
        'glow-orange-lg': '0 0 40px rgba(232, 100, 15, 0.4)',
        'brutal': '8px 8px 0px rgba(0, 0, 0, 0.3)',
        'inset-brutal': 'inset 4px 4px 8px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(232, 100, 15, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(232, 100, 15, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};

export default config;
