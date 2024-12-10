module.exports = {
  root: true,
  env: {
    // 环境
    browser: true, // 浏览器环境中的全局变量。
    node: true, // Node.js 全局变量和 Node.js 作用域。
    es6: true // 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
  },
  parser: 'vue-eslint-parser', // 解析器
  parserOptions: {
    // 解析器配置
    parser: '@typescript-eslint/parser', // 解析器
    ecmaVersion: 'latest', // 5（默认）， 你可以使用 6、7、8、9 或 10 来指定你想要使用的 ECMAScript 版本。你也可以用年份命名的版本号，你也可以用 latest 来指向最新的版本。
    sourceType: 'module', // 设置为 "script" (默认) 或 "module"（如果你的代码是 ECMAScript 模块)。
    jsxPragma: 'React', // 支持 ReactJSX 语法
    ecmaFeatures: {
      // 表示你想使用的额外的语言特性
      jsx: true // 启用 JSX
    }
  },
  plugins: ['import', 'sonarjs', '@typescript-eslint'], // 插件
  extends: [
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended' // 一定要放在最后。因为 extends 中后引入的规则会覆盖前面的规则。
  ],
  rules: {
    complexity: ['error', 15], // 圈复杂度
    'sonarjs/no-identical-functions': 'error', // 相同或类似函数
    'max-params': ['error', 5], // 函数的最大入参数量
    // 'max-lines': ['warn', { max: 800 }], // 文件长度--已舍弃使用
    // '@kfe/kso/max-lines-in-function': ['error', 80], // 函数长度--已舍弃使用
    indent: 0, // 缩进
    // other rules
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    '@typescript-eslint/no-explicit-any': ['warn'],
    'vue/multi-word-component-names': 'off',
    'sonarjs/no-identical-functions': 'off'
  },
  overrides: [
    // 若要开启组件命名规则校验，建议选这种方式
    {
      files: ['src/views/index.vue', 'src/views/**/index.vue'], // 匹配 views 和任意多级路径中的 index.vue
      rules: {
        'vue/multi-word-component-names': 'off' // 给上面匹配的文件指定规则——关闭命名规则校验
      }
    }
  ]
}
