/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                terminal: {
                    bg: '#0d1117',
                    panel: '#161b22',
                    border: '#30363d',
                    text: '#c9d1d9',
                    muted: '#8b949e',
                    accent: '#58a6ff',
                    success: '#238636',
                    warning: '#d29922',
                    error: '#f85149',
                }
            },
            fontFamily: {
                mono: ['"Fira Code"', '"JetBrains Mono"', 'Consolas', 'monospace'],
            }
        },
    },
    plugins: [],
}
