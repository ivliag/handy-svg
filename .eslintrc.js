module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 'off'
    },
    overrides: [
        {
            files: ['.eslintrc.js'],
            env: {
                browser: false,
                node: true
            }
        }
    ]
}
