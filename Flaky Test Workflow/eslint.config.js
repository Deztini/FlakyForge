'use strict'

const neostandard = require('neostandard')

module.exports = [
  ...neostandard({
    ts: true,
    ignores: [
      'node_modules',
      'dist',
      'build',
      'coverage'
    ]
  }),

  {
    rules: {
      // Keep code clean and consistent
      'max-len': ['error', {
        code: 120,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreComments: true
      }],

      // Force consistent imports/exports style clarity
      'no-console': 'warn',

      // Prevent silent bugs in production
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
    }
  },

  {
    files: ['**/*.d.ts'],
    rules: {
      'max-len': 'off'
    }
  }
]
