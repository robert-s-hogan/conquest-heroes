module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
    'plugin:vue/vue3-recommended', // Vue 3 recommended rules
    'plugin:prettier/recommended', // Integrate Prettier
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: '@babel/eslint-parser',
    requireConfigFile: false,
  },
  plugins: ['vue', 'tailwindcss', 'cypress', 'prettier'],
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    'public/',
    // Add any other paths you want ESLint to ignore
  ],
  rules: {
    // Tailwind CSS rules
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/no-custom-classname': 'off',

    // Prettier integration
    'prettier/prettier': 'error',

    // Vue.js Best Practices
    'vue/multi-word-component-names': [
      'error',
      {
        ignores: ['App'], // Add more single-word components if necessary
      },
    ],
    'vue/v-slot-style': [
      'error',
      {
        atComponent: 'v-slot',
        default: 'v-slot',
        named: 'v-slot',
      },
    ],
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/require-prop-types': 'warn',
    'vue/no-mutating-props': 'error',
    'vue/no-v-html': 'warn',
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],

    // Composition API Specific Rules
    'vue/script-setup-uses-vars': 'error',
    'vue/no-setup-props-destructure': 'error',
    'vue/define-emits-declaration': 'error',
    'vue/define-props-declaration': 'error',
    'vue/no-duplicate-attributes': 'error',

    // You can add more custom rules here
  },
  overrides: [
    {
      files: ['cypress/**/*.js', 'cypress/**/*.vue'],
      env: {
        'cypress/globals': true,
      },
      extends: ['plugin:cypress/recommended'],
    },
  ],
}
