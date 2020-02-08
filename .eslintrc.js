module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    "camelcase": "off",
    "node/no-missing-import": "off",
    "node/no-unpublished-import": "off",
    "no-console": "error",
    "semi": [
      "error",
      "never"
    ],
    "jsx-quotes": [
      "error",
      "prefer-single"
    ],
    "prefer-const": "error",
    "no-var": "error",
    "comma-dangle": [
      "error",
      "always-multiline"
    ],
    "max-len": [
      "error",
      {
        "code": 135,
        "ignoreStrings": true,
        "ignoreTemplateLiterals": true,
        "ignoreRegExpLiterals": true
      }
    ],
    "@typescript-eslint/member-delimiter-style": [
      "error",
      {
        "multiline": {
          "delimiter": "comma",
          "requireLast": true
        }
      }
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/indent": [
      "error",
      2
    ],
    "@typescript-eslint/no-object-literal-type-assertion": "off",
    "@typescript-eslint/member-ordering": [
      "error"
    ],
    "@typescript-eslint/ban-ts-ignore": [
      "warn"
    ],
    "no-undef": "off",
    "no-unused-vars": "off",
    "node/no-unsupported-features/es-syntax": [
      "error",
      {
        "version": ">=12.8.0",
        "ignores": [
          "modules"
        ]
      }
    ]
  }
}
