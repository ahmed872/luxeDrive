import js from '@eslint/js';
import next from 'eslint-config-next';
import boundaries from 'eslint-plugin-boundaries';
import tseslint from 'typescript-eslint';

/**
 * Module dependency graph (ADR section 04).
 *
 * `allow` lists are exhaustive: anything not listed is a lint error, so a new
 * cross-module import has to be a deliberate change to this file rather than
 * something that quietly appears in a pull request.
 */
const MODULE_DEPENDENCIES = {
  core: [],
  identity: ['core'],
  media: ['core'],
  catalog: ['core', 'media'],
  search: ['core', 'catalog'],
  inventory: ['core', 'catalog'],
  pricing: ['core', 'catalog'],
  cart: ['core', 'catalog', 'pricing', 'inventory'],
  customers: ['core', 'identity', 'catalog'],
  payments: ['core'],
  notifications: ['core', 'settings'],
  settings: ['core', 'media'],
  content: ['core', 'media', 'catalog'],
  analytics: ['core'],
  orders: [
    'core',
    'catalog',
    'pricing',
    'inventory',
    'cart',
    'customers',
    'payments',
    'notifications',
  ],
};

const moduleRules = Object.entries(MODULE_DEPENDENCIES).map(([name, allowed]) => ({
  from: [['module', { name }]],
  allow: [
    // A module may always import within itself.
    ['module', { name }],
    ...allowed.map((dependency) => ['module', { name: dependency }]),
  ],
}));

export default tseslint.config(
  {
    ignores: [
      'legacy/**',
      '.next/**',
      'out/**',
      'node_modules/**',
      'coverage/**',
      'next-env.d.ts',
      'generated/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...next,

  {
    files: ['**/*.{ts,tsx,mjs}'],
    // `import` is already registered by eslint-config-next; redefining a
    // plugin is a hard error in flat config, so only `boundaries` is added.
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { alwaysTryTypes: true },
      },
      'boundaries/elements': [
        { type: 'module', pattern: 'src/modules/*', capture: ['name'], mode: 'folder' },
        { type: 'app', pattern: 'src/app/**/*', mode: 'file' },
        { type: 'components', pattern: 'src/components/**/*', mode: 'file' },
        { type: 'lib', pattern: 'src/lib/**/*', mode: 'file' },
      ],
      'boundaries/include': ['src/**/*'],
    },
    rules: {
      // Circular dependencies are forbidden outright (P01 requirement).
      'import/no-cycle': ['error', { maxDepth: Infinity, ignoreExternal: true }],

      // The module graph above is the contract.
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            ...moduleRules,
            // Presentation layers may use any module's public surface, and
            // may compose freely among themselves.
            { from: ['app', 'components', 'lib'], allow: ['module', 'app', 'components', 'lib'] },
          ],
        },
      ],

      // Cross-module imports go through the module's index, never a deep path.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/modules/*/*'],
              message:
                'Import a module through its public surface (@/modules/<name>), not a file inside it.',
            },
          ],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Type-aware rules are deliberately not enabled: they require
      // `parserOptions.project`, which roughly triples lint time, and none of
      // the boundary or correctness rules above need type information.
    },
  },

  // The presentation layer legitimately reaches into module files that are not
  // re-exported yet (for example `@/modules/core/env.client` in a client
  // component, which must not pull the server-only barrel).
  {
    files: ['src/app/**/*.{ts,tsx}', 'src/components/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': 'off' },
  },

  {
    files: ['**/*.test.ts', '**/*.test.tsx', 'vitest.config.mts'],
    rules: { 'no-restricted-imports': 'off', 'boundaries/element-types': 'off' },
  },
);
