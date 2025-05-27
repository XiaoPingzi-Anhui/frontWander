import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入插件
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

// 共享的全局配置
const sharedGlobals = {
  ...globals.browser,
  ...globals.es2020,
};

// 共享的基本语言选项
const sharedLanguageOptions = {
  ecmaVersion: 2020,
  sourceType: 'module',
  globals: sharedGlobals,
};

// 共享的插件配置
const sharedPlugins = {
  prettier: prettierPlugin,
  import: importPlugin,
};

// 共享的规则配置
const sharedRules = {
  // Prettier 规则
  'prettier/prettier': 'error',

  // 共享的 Import 规则
  'import/no-unresolved': ['error', { ignore: ['^/'] }], // 忽略以/开头的路径，这是Vite的公共资源引用方式
  'import/no-useless-path-segments': 'error', // 防止不必要的路径段
  'import/no-duplicates': 'error', // 防止从同一模块多次导入
  'import/newline-after-import': 'error', // 导入语句后需要空行
  'import/order': [
    'error',
    {
      groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'object', 'type'],
      'newlines-between': 'always', // 在不同组之间添加新行
      alphabetize: { order: 'asc', caseInsensitive: true }, // 按字母顺序排序
      pathGroups: [
        {
          pattern: 'react*',
          group: 'builtin',
          patternOptions: {
            noComment: false,
          },
          position: 'before',
        },
        {
          pattern: '@/**',
          group: 'external',
          position: 'after',
        },
      ],
      pathGroupsExcludedImportTypes: [],
    },
  ],
};

// 共享的设置配置
const sharedSettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: './tsconfig.app.json', // 指定包含路径别名的tsconfig文件
    },
  },
};

// TypeScript 特有的规则
const tsRules = {
  ...sharedRules,
  // React Hooks 规则
  ...reactHooks.configs.recommended.rules,
  // React Refresh 规则
  'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  // TypeScript特有的 Import 规则
  'import/named': 'error', // 确保命名导入对应于远程文件中的命名导出
  'import/default': 'error', // 确保默认导入对应于远程文件中的默认导出
  'import/namespace': 'error', // 确保通过 * 导入的内容都存在
  'import/no-dynamic-require': 'warn', // 禁止使用动态require
  'import/no-mutable-exports': 'error', // 禁止导出可变变量
};

// TypeScript 特有的设置
const tsSettings = {
  ...sharedSettings,
  'import/parsers': {
    '@typescript-eslint/parser': ['.ts', '.tsx'],
  },
};

// JavaScript 特有的设置
const jsSettings = {
  ...sharedSettings,
};

export default tseslint.config(
  // 全局忽略配置
  { ignores: ['dist'] },

  // TypeScript 配置
  {
    // 应用配置的文件模式
    files: ['**/*.{ts,tsx}'],

    // 语言选项
    languageOptions: {
      ...sharedLanguageOptions,
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.app.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // 插件配置
    plugins: {
      ...sharedPlugins,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    // 规则配置
    rules: tsRules,

    // TypeScript路径别名解析配置
    settings: tsSettings,
  },

  // JavaScript 配置
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: sharedLanguageOptions,
    plugins: sharedPlugins,
    rules: sharedRules,
    settings: jsSettings,
  }
);
