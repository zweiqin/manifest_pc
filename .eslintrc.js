module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: ['plugin:vue/recommended', 'eslint:recommended'],
  // "plugins": ["prettier"],
  // add your custom rules here
  // it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    // "prettier/prettier": "error",
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 10,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    // 修改之后的，原来的是"vue/name-property-casing": ["error", "PascalCase"],修改之后同时允许帕斯卡命名法和短横线命名法
    'vue/name-property-casing': ['error', 'kebab-case' || 'PascalCase'],
    'vue/no-v-html': 'off',
    // 新增的，关闭自闭合标签错误提示
    'vue/html-self-closing': 'off',
    // 新增的，标签里的各类属性的排序顺序，不符合规则则报错（原先默认的为警告）
    'vue/attributes-order': [
      'error',
      {
        order: ['DEFINITION', 'LIST_RENDERING', 'CONDITIONALS', 'RENDER_MODIFIERS', 'GLOBAL', ['UNIQUE', 'SLOT'], 'TWO_WAY_BINDING', 'OTHER_DIRECTIVES', 'OTHER_ATTR', 'EVENTS', 'CONTENT'],
        alphabetical: false
      }
    ],
    'array-bracket-spacing': [2, 'never'], // 是否允许非空数组里面有多余的空格
    'accessor-pairs': 2, // 在对象中使用getter/setter
    'arrow-spacing': [
      2,
      {
        // =>的前/后括号
        before: true,
        after: true
      }
    ],
    'arrow-parens': 0, // 箭头函数用小括号括起来
    'block-spacing': [2, 'always'],
    'brace-style': [
      2,
      '1tbs',
      {
        // 大括号风格
        allowSingleLine: true
      }
    ],
    'block-scoped-var': 0, // 块语句中使用var
    'callback-return': 0, // 允许多次调用回调什么的
    camelcase: [
      0,
      {
        // 强制驼峰法命名
        properties: 'always'
      }
    ],
    // 修改之后的，原来的是'comma-dangle': [2, 'never'],但是如果部分设为always之后则需要在满足条件的地方添加逗号
    'comma-dangle': [
      2,
      {
        // 对象字面量项尾不能有逗号
        arrays: 'never',
        objects: 'never',
        imports: 'never',
        exports: 'never',
        functions: 'never'
      }
    ],
    'comma-spacing': [
      2,
      {
        // 逗号前后的空格
        before: false,
        after: true
      }
    ],
    'comma-style': [2, 'last'], // 逗号风格，换行时在行首还是行尾
    complexity: [0, 11], // 循环复杂度
    'computed-property-spacing': [0, 'never'], // 是否允许计算后的键名什么的
    'consistent-return': 0, // return 后面是否允许省略
    'consistent-this': [2, 'that'], // this别名
    'constructor-super': 2, // 非派生类不能调用super，派生类必须调用super
    curly: [2, 'multi-line'], // 必须使用 if(){} 中的{}
    'default-case': 2, // switch语句最后必须有default
    'dot-location': [2, 'property'], // 对象访问符的位置，换行的时候在行首还是行尾
    'dot-notation': [0, { allowKeywords: true }], // 避免不必要的方括号
    'eol-last': 2, // 文件以单一的换行符结束
    // 修改之后的，原来的是'eqeqeq': ["error", "always", {"null": "ignore"}],改之后即可使用三等，也可使用二等
    eqeqeq: 'off', // 必须使用全等
    'func-names': 0, // 函数表达式必须有名字
    'func-style': [0, 'declaration'], // 函数风格，规定只能使用函数声明/函数表达式
    'generator-star-spacing': [
      2,
      {
        // 生成器函数*的前后空格
        before: true,
        after: true
      }
    ],
    'guard-for-in': 0, // for in循环要用if语句过滤
    'handle-callback-err': [2, '^(err|error)$'], // nodejs 处理错误
    'id-length': 0, // 变量名长度
    'id-match': 0, // 命名检测
    indent: [
      2,
      2,
      {
        // 缩进风格
        SwitchCase: 1
      }
    ],
    'init-declarations': 0, // 声明时必须赋初值
    'jsx-quotes': [2, 'prefer-single'],
    'key-spacing': [
      2,
      {
        // 对象字面量中冒号的前后空格
        beforeColon: false,
        afterColon: true
      }
    ],
    'keyword-spacing': [
      2,
      {
        before: true,
        after: true
      }
    ],
    'lines-around-comment': 0, // 行前/行后备注
    'linebreak-style': [0, 'windows'], // 换行风格
    'max-depth': [0, 4], // 嵌套块深度
    'max-len': [0, 80, 4], // 字符串最大长度
    'max-nested-callbacks': [0, 2], // 回调嵌套深度
    'max-params': [0, 3], // 函数最多只能有3个参数
    'max-statements': [0, 10], // 函数内最多有几个声明
    'new-cap': [
      2,
      {
        // 函数名首行大写必须使用new方式调用，首行小写必须用不带new方式调用
        newIsCap: true,
        capIsNew: false
      }
    ],
    'new-parens': 2, // new时必须加小括号
    'newline-after-var': 0, // 变量声明后是否需要空一行

    'no-alert': 0, // 禁止使用alert confirm prompt
    'no-array-constructor': 2, // 禁止使用数组构造器
    'no-bitwise': 0, // 禁止使用按位运算符
    'no-caller': 2, // 禁止使用arguments.caller或arguments.callee
    'no-catch-shadow': 2, // 禁止catch子句参数与外部作用域变量同名
    'no-console': 'off', // 禁止使用console
    'no-class-assign': 2, // 禁止给类赋值
    'no-cond-assign': 2, // 禁止在条件表达式中使用赋值语句
    'no-const-assign': 2, // 禁止修改const声明的变量
    'no-constant-condition': 2, // 禁止在条件中使用常量表达式 if(true) if(1)
    'no-continue': 0, // 禁止使用continue
    'no-control-regex': 0, // 禁止在正则表达式中使用控制字符
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0, // 禁止使用debugger
    'no-delete-var': 2, // 不能对var声明的变量使用delete操作符
    'no-div-regex': 1, // 不能使用看起来像除法的正则表达式/=foo/
    'no-dupe-args': 2, // 函数参数不能重复
    'no-dupe-class-members': 2,
    'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
    'no-duplicate-case': 2, // switch中的case标签不能重复
    'no-else-return': 2, // 如果if语句里面有return,后面不能跟else语句
    'no-empty': 2, // 块语句中的内容不能为空
    'no-empty-character-class': 2, // 正则表达式中的[]内容不能为空
    'no-empty-label': 0, // 禁止使用空label
    'no-eq-null': 2, // 禁止对null使用==或!=运算符
    'no-empty-pattern': 2,
    'no-eval': 2, // 禁止使用eval
    'no-ex-assign': 2, // 禁止给catch语句中的异常参数赋值
    'no-extend-native': 2, // 禁止扩展native对象
    'no-extra-bind': 2, // 禁止不必要的函数绑定
    'no-extra-boolean-cast': 2, // 禁止不必要的bool转换
    'no-extra-parens': [2, 'functions'], // 禁止非必要的括号
    'no-extra-semi': 2, // 禁止多余的冒号
    'no-fallthrough': 2, // 禁止switch穿透
    'no-floating-decimal': 2, // 禁止省略浮点数中的0 .5 3.
    'no-func-assign': 2, // 禁止重复的函数声明
    'no-implicit-coercion': 1, // 禁止隐式转换
    'no-implied-eval': 2, // 禁止使用隐式eval
    'no-inline-comments': 0, // 禁止行内备注
    'no-inner-declarations': [2, 'functions'], // 禁止在块语句中使用声明（变量或函数）
    'no-invalid-regexp': 2, // 禁止无效的正则表达式
    'no-invalid-this': 2, // 禁止无效的this，只能用在构造器，类，对象字面量
    'no-irregular-whitespace': 2, // 不能有不规则的空格
    'no-iterator': 2, // 禁止使用__iterator__ 属性
    'no-label-var': 2, // label名不能与var声明的变量名相同
    'no-labels': [
      2,
      {
        // 禁止标签声明
        allowLoop: false,
        allowSwitch: false
      }
    ],
    'no-lone-blocks': 2, // 禁止不必要的嵌套块
    'no-lonely-if': 0, // 禁止else语句内只有if语句
    'no-loop-func': 1, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
    'no-mixed-requires': [0, false], // 声明时不能混用声明类型
    'no-mixed-spaces-and-tabs': 2, // 禁止混用tab和空格
    'no-multi-spaces': 2, // 不能用多余的空格
    'no-multi-str': 2, // 字符串不能用\换行
    'no-multiple-empty-lines': [
      2,
      {
        // 空行最多不能超过2行
        max: 1
      }
    ],
    'no-native-reassign': 2, // 不能重写native对象
    'no-negated-in-lhs': 2, // in 操作符的左边不能有!
    'no-nested-ternary': 0, // 禁止使用嵌套的三目运算
    'no-new': 1, // 禁止在使用new构造一个实例后不赋值
    'no-new-func': 1, // 禁止使用new Function
    'no-new-object': 2, // 禁止使用new Object()
    'no-new-require': 2, // 禁止使用new require
    'no-new-symbol': 2,
    'no-new-wrappers': 2, // 禁止使用new创建包装实例，new String new Boolean new Number
    'no-obj-calls': 2, // 不能调用内置的全局对象，比如Math() JSON()
    'no-octal': 2, // 禁止使用八进制数字
    'no-octal-escape': 2, // 禁止使用八进制转义序列
    'no-param-reassign': 2, // 禁止给参数重新赋值
    'no-path-concat': 2, // node中不能使用__dirname或__filename做路径拼接
    'no-plusplus': 0, // 禁止使用++，--
    'no-process-env': 0, // 禁止使用process.env
    'no-process-exit': 0, // 禁止使用process.exit()
    'no-proto': 2, // 禁止使用__proto__属性
    'no-redeclare': 2, // 禁止重复声明变量
    'no-regex-spaces': 2, // 禁止在正则表达式字面量中使用多个空格 /foo bar/
    'no-restricted-modules': 0, // 如果禁用了指定模块，使用就会报错
    'no-return-assign': [2, 'except-parens'], // return 语句中不能有赋值表达式
    'no-script-url': 0, // 禁止使用javascript:void(0)
    'no-self-assign': 2,
    'no-self-compare': 2, // 不能比较自身
    'no-sequences': 2, // 禁止使用逗号运算符
    'no-shadow': 2, // 外部作用域中的变量不能与它所包含的作用域中的变量或参数同名
    'no-shadow-restricted-names': 2, // 严格模式中规定的限制标识符不能作为声明时的变量名使用
    'no-spaced-func': 2, // 函数调用时 函数名与()之间不能有空格
    'no-sparse-arrays': 2, // 禁止稀疏数组， [1,,2]
    'no-sync': 0, // nodejs 禁止同步方法
    'no-ternary': 0, // 禁止使用三目运算符
    'no-this-before-super': 2, // 在调用super()之前不能使用this或super
    'no-throw-literal': 2, // 禁止抛出字面量错误 throw "error";
    'no-trailing-spaces': 2, // 一行结束后面不要有空格
    'no-undef': 2, // 不能有未定义的变量
    'no-undef-init': 2, // 变量初始化时不能直接给它赋值为undefined
    'no-undefined': 0, // 不能使用undefined
    'no-unexpected-multiline': 2, // 避免多行表达式
    'no-underscore-dangle': 1, // 标识符不能以_开头或结尾
    'no-unmodified-loop-condition': 2,
    'no-unneeded-ternary': [
      2,
      {
        // 禁止不必要的嵌套 var isYes = answer === 1 ? true : false;
        defaultAssignment: false
      }
    ],
    'no-unreachable': 2, // 不能有无法执行的代码
    'no-unused-expressions': 2, // 禁止无用的表达式
    'no-unsafe-finally': 2,
    'no-unused-vars': [
      2,
      {
        // 不能有声明后未被使用的变量或参数
        vars: 'all',
        args: 'none'
      }
    ],
    'no-use-before-define': 2, // 未定义前不能使用
    'no-useless-call': 2, // 禁止不必要的call和apply
    'no-useless-computed-key': 2,
    'no-useless-constructor': 2,
    'no-useless-escape': 0,
    'no-void': 2, // 禁用void操作符
    'no-var': 0, // 禁用var，用let和const代替
    'no-warning-comments': [1, { terms: ['todo', 'fixme', 'xxx'], location: 'start' }], // 不能有警告备注
    'no-whitespace-before-property': 2,
    'no-with': 2, // 禁用with
    'object-curly-spacing': [
      2,
      'always',
      {
        // 大括号内是否允许不必要的空格
        objectsInObjects: false
      }
    ],
    'object-shorthand': 0, // 强制对象字面量缩写语法
    'one-var': [
      2,
      {
        // 连续声明
        initialized: 'never'
      }
    ],
    'operator-assignment': [0, 'always'], // 赋值运算符 += -=什么的
    'operator-linebreak': [
      2,
      'after',
      {
        // 换行时运算符在行尾还是行首
        overrides: {
          '?': 'before',
          ':': 'before'
        }
      }
    ],
    'padded-blocks': [2, 'never'], // 块语句内行首行尾是否要空行
    'prefer-const': 2, // 首选const
    'prefer-spread': 0, // 首选展开运算
    'prefer-reflect': 0, // 首选Reflect的方法
    quotes: [
      2,
      'single',
      {
        // 引号类型 `` "" ''
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'quote-props': [0, 'always'], // 对象字面量中的属性名是否强制双引号
    radix: 2, // parseInt必须指定第二个参数
    'require-yield': 0, // 生成器函数必须有yield
    semi: [2, 'never'], // 语句强制分号结尾
    'semi-spacing': [
      2,
      {
        // 分号前后空格
        before: false,
        after: true
      }
    ],
    'sort-vars': 0, // 变量声明时排序
    'space-after-keywords': [0, 'always'], // 关键字后面是否要空一格
    'space-before-blocks': [2, 'always'], // 不以新行开始的块{前面要不要有空格
    // 修改之后的，原来的是'space-before-function-paren': [2, 'never'],修改之后
    'space-before-function-paren': [
      2,
      {
        // 函数定义时括号前面要不要有空格
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }
    ],
    'space-in-parens': [2, 'never'], // 小括号里面要不要有空格
    'space-infix-ops': 2, // 中缀操作符周围要不要有空格
    'space-return-throw-case': 0, // return throw case后面要不要加空格
    'space-unary-ops': [
      2,
      {
        // 一元运算符的前/后要不要加空格
        words: true,
        nonwords: false
      }
    ],
    'spaced-comment': [
      2,
      'always',
      {
        // 注释风格要要有空格什么的
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    strict: 2, // 使用严格模式
    'template-curly-spacing': [2, 'never'],
    'use-isnan': 2, // 禁止比较时使用NaN，只能用isNaN()
    'valid-jsdoc': 0, // jsdoc规则
    'valid-typeof': 2, // 必须使用合法的typeof的值
    'vars-on-top': 2, // var必须放在作用域顶部
    'wrap-iife': [2, 'any'], // 立即执行函数表达式的小括号风格
    'wrap-regex': 0, // 正则表达式字面量用小括号包起来
    'yield-star-spacing': [2, 'both'],
    yoda: [2, 'never'] // 禁止尤达条件
  }
}
