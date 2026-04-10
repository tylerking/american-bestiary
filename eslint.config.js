import { includeIgnoreFile } from '@eslint/compat'
import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import perfectionist from 'eslint-plugin-perfectionist'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import { fileURLToPath } from 'node:url'
import { configs, parser } from 'typescript-eslint'

import svelteConfig from './svelte.config.js'

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url))

export default [
  includeIgnoreFile(gitignorePath),
  js.configs.recommended,
  ...configs.recommendedTypeChecked,
  ...svelte.configs.recommended,
  perfectionist.configs['recommended-alphabetical'],

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    plugins: {
      import: importPlugin
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/prefer-optional-chain': 'warn',
      'import/no-default-export': 'warn',
      'no-console': ['warn', { allow: ['debug', 'error', 'info', 'warn'] }],
      'no-undef': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      quotes: ['error', 'single'],
      semi: ['error', 'never']
    }
  },

  {
    files: ['tests/e2e/fixtures.ts'],
    rules: {
      'no-empty-pattern': 'off'
    }
  },

  {
    files: [
      'eslint.config.*',
      'svelte.config.*',
      'vite.config.*',
      'playwright.config.*'
    ],
    ...configs.disableTypeChecked,
    rules: {
      ...configs.disableTypeChecked.rules,
      'import/no-default-export': 'off'
    }
  },

  {
    files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
    ignores: ['eslint.config.js', 'svelte.config.js'],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        parser,
        projectService: true,
        svelteConfig,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      'svelte/block-lang': [
        'error',
        {
          enforceScriptPresent: false,
          enforceStylePresent: false,
          script: ['ts', null],
          style: 'scss'
        }
      ],
      'svelte/first-attribute-linebreak': [
        'error',
        {
          multiline: 'below',
          singleline: 'below'
        }
      ],
      'svelte/html-quotes': [
        'error',
        {
          dynamic: {
            avoidInvalidUnquotedInHTML: false,
            quoted: false
          },
          prefer: 'single'
        }
      ],
      'svelte/indent': [
        'error',
        {
          alignAttributesVertically: false,
          ignoredNodes: [],
          indent: 2,
          switchCase: 1
        }
      ],
      'svelte/max-attributes-per-line': [
        'error',
        {
          multiline: 1,
          singleline: 1
        }
      ],
      'svelte/no-navigation-without-resolve': 'off',
      'svelte/shorthand-attribute': [
        'error',
        {
          prefer: 'always'
        }
      ],
      'svelte/sort-attributes': [
        'error',
        {
          order: [
            {
              match: '/.*/u',
              sort: 'alphabetical'
            }
          ]
        }
      ]
    }
  }
]
