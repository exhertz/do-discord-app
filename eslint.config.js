import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
	{ files: ['**/*.{js,mjs,cjs,ts}'] },
	{ languageOptions: { globals: globals.node } },
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
	{
		rules: {
			'indent': ['error', 'tab', { 'SwitchCase': 1 }],
			'no-tabs': 'off',
			'comma-dangle': ['warn', 'never'],
			'object-curly-spacing': ['warn', 'always'],
			'prefer-destructuring': ['warn'],
			'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
			'semi': ['error', 'always'],
			'camelcase': ['warn'],
			'dot-notation': ['warn'],
			'no-useless-escape': 'off',
			'max-len': ['error', 160],
			'no-unused-vars': ['warn'],
			'no-undef': ['warn'],
			'default-case': 'off',
			'global-require': 'off',
			'import/no-dynamic-require': 'off',
			'import/no-unresolved': 'off',
			'no-use-before-define': 'off',
			'import/extensions': 'off',
			'consistent-return': 'off',
			'eol-last': 'off',
			'no-console': 'off',
			'eqeqeq': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'quotes': ['error', 'single']
		}
	}
];
