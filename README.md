# Minii

[![Version](http://img.shields.io/npm/v/minii.svg)](https://www.npmjs.org/package/minii)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

## Why
I wanna keep it simple when developing Wechat Mini app. No need to import another framework(React, Vue) or bundler(Webpack, Gulp), the only thing I need is a state management.

我希望只依照小程序的文档，用小程序原生框架进行开发而不用去引入其它前端框架从而增加复杂度。而在用原生框架时，唯一缺失的就是一个类似Redux，Mobx这样的状态管理工具

## Installation
The base library should greater than 2.2.1 (小程序基础库版本 2.2.1 或以上)

1. `$ npm install minii --production`

2. In WeChat Developer Tool, Tools -> build npm (在开发者工具里面依次点击 工具 -> 构建 npm)

3. In WeChat Developer Tool, Details -> check `Use NPM module` (在开发者工具的详情里面勾选 `使用 npm 模块`) 

Official doc: [how to use npm in wechat](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?t=18082018)

## How to use
There is only two API from Minii, `observe` and `mapToData` (minii 只有两个API方法 `observe` 和 `mapToData`)

![carbon](https://user-images.githubusercontent.com/5305874/47693229-cb79cc80-dc33-11e8-834c-a6715f8d9cc5.png)


## License

MIT


