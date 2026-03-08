/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                // 오늘의집 스타일 컬러
                primary: {
                    DEFAULT: '#35c5f0',
                    dark: '#2bb0d8',
                    light: '#5cd4f5',
                },
                accent: {
                    DEFAULT: '#ff6f61',
                    dark: '#e55a4e',
                },
                background: {
                    DEFAULT: '#ffffff',
                    secondary: '#f7f8fa',
                    tertiary: '#f0f0f0',
                },
                text: {
                    DEFAULT: '#2f3438',
                    secondary: '#828c94',
                    tertiary: '#c2c8cc',
                },
                border: {
                    DEFAULT: '#ededed',
                    dark: '#dadce0',
                },
            },
            fontFamily: {
                sans: ['Pretendard', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            boxShadow: {
                'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
                'header': '0 1px 0 rgba(0, 0, 0, 0.06)',
            },
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.2s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
