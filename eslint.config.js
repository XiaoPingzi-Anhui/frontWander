import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 导入插件
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  // 全局忽略配置
  { ignores: ['dist'] },

  // 主配置
  {
    // 应用配置的文件模式
    files: ['**/*.{ts,tsx}'],

    // 语言选项
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      sourceType: 'module',
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
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      prettier: prettierPlugin,
    },

    // 规则配置
    rules: {
      // React Hooks 规则
      ...reactHooks.configs.recommended.rules,

      // React Refresh 规则
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Prettier 规则
      'prettier/prettier': 'error',
    },
  }
);

// 为 JavaScript 文件添加基本配置
export const jsConfig = {
  files: ['**/*.js', '**/*.jsx'],
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.es2020,
    },
  },
  rules: {
    'prettier/prettier': 'error',
  },
};
