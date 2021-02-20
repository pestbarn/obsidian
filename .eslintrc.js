module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint',
        sourceType: 'module'
    },
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: ['plugin:vue/recommended', 'eslint:recommended'],
    plugins: ['html', 'vue'],
    globals: {
        firebase: true,
        module: true
    },
    rules: {
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        quotes: ['warn', 'single'],
        semi: ['error', 'never'],
        'no-console': 0,
        'no-useless-escape': 0,
        'comma-spacing': 'warn',
        'comma-style': 'warn',
        'space-infix-ops': ['error', { int32Hint: true }],
        'brace-style': 'warn',
        'no-multiple-empty-lines': 'warn',
        'func-call-spacing': ['warn', 'never'],
        'key-spacing': 'warn',
        'no-array-constructor': 'error',
        'no-new-object': 'error',
        'no-duplicate-imports': 'error',
        'no-irregular-whitespace': 0,
        'no-multi-spaces': 'warn',
        'no-path-concat': 'error',
        'no-template-curly-in-string': 'warn',
        'template-curly-spacing': 'warn',
        'no-trailing-spaces': 'warn',
        'object-property-newline': 'error',
        'padded-blocks': ['warn', 'never'],
        'rest-spread-spacing': 'warn',
        'semi-spacing': 'error',
        'space-in-parens': 'error',
        'spaced-comment': 'error',
        'vue/html-indent': ['error', 4],
        'vue/max-attributes-per-line': 0,
        'vue/attributes-order': 0,
        'vue/singleline-html-element-content-newline': 0,
        'vue/html-self-closing': 0,
        'vue/require-prop-type-constructor': 0,
        'vue/require-default-prop': 0
    }
}
