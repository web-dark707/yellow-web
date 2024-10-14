import { defineConfig } from 'windicss/helpers';

export default defineConfig({
    extract: {
        include: ['**/*.{jsx,js,ts,tsx,css,html}'],
        exclude: ['node_modules', '.git', 'dist/**/*'],
    },
    theme: {
        extend: {
            zIndex: {
                '[-1]': '-1',
                '9999': '9999',
            },
            backgroundColor: {
                baseColor: '#0C0C17',
                primaryColor: '#C95793',
                success: '#4CAF50',
                error: '#FF5A5A',
            },
            fontSize: {
                baseSize: '12px',
                lgSize: '14px',
            },
            textColor: {
                baseColor: '#FFFFFF',
                primaryColor: '#FE608E',
                success: '#4CAF50',
                error: '#D9001B',
            },
            borderColor: {
                baseColor: '#FFFFFF',
                primaryColor: '#FE618E',
                success: '#4CAF50',
                error: '#FF5A5A',
            },
            placeholderColor: {
                baseColor: '#E3E3E3',
            },
        },
    },
});
