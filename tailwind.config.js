export default {content: [
  './resources/views/**/*.blade.php',
  './resources/js/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#0A0A5C',
          royal: '#0B3BD6',
          hover: '#06127A',
          gold: '#E2B640',
          'gold-soft': '#FBF3DC',
          'gold-ink': '#7A5C0E',
        },
        canvas: '#F7F8FC',
        line: '#E5E8F0',
        tint: '#E8EEFC',
        secondary: {
          DEFAULT: '#DCEBFF',
          ink: '#1A6FD6',
          hover: '#C9DEFB',
        },
        ink: {
          DEFAULT: '#0F1226',
          soft: '#5B6075',
          faint: '#9AA0B4',
        },
        danger: {
          DEFAULT: '#E5484D',
          soft: '#FDECEC',
          strong: '#C93A3F',
        },
        success: {
          DEFAULT: '#1F9D63',
          soft: '#E4F5EC',
          ink: '#146C43',
        },
        archive: {
          soft: '#EEF0F5',
          ink: '#454B63',
        },
        // Legacy aliases mapped onto the new system
        navy: {
          50: '#F7F8FC',
          100: '#E5E8F0',
          200: '#D3D8E5',
          300: '#B5BDD2',
          600: '#1A6FD6',
          700: '#0B3BD6',
          800: '#06127A',
          900: '#0A0A5C',
          950: '#05053A',
        },
        sun: { 50: '#F3F6FE', 100: '#E8EEFC', 300: '#C7D5FA', 400: '#E2B640', 500: '#C99A1F' },
        muted: '#5B6075',
        alert: { 100: '#FDECEC', 600: '#E5484D', 700: '#C93A3F' },
        ok: { 100: '#E4F5EC', 600: '#1F9D63' },
      },
      fontFamily: {
        sans: ['Outfit', 'Urbanist', 'Poppins', 'system-ui', 'sans-serif'],
        serif: ['"Cormorant SC"', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 18, 38, 0.04)',
        pop: '0 12px 32px -12px rgba(10, 10, 92, 0.25)',
      },
    },
  },
};
