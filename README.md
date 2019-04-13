# Minii

[![Version](http://img.shields.io/npm/v/minii.svg)](https://www.npmjs.org/package/minii)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![Build Status](https://travis-ci.org/wwayne/minii.svg?branch=master)](https://travis-ci.org/wwayne/minii)

[download-image]: https://img.shields.io/npm/dm/minii.svg?style=flat-square
[download-url]: https://npmjs.org/package/minii

## 谁在使用
![gh_a1cda2fbab45_258](https://user-images.githubusercontent.com/5305874/53417621-e9541400-3a10-11e9-9dd7-86ab851ddab5.jpg)
![gh_f977d523b1b8_258](https://user-images.githubusercontent.com/5305874/56073712-19961d00-5ddb-11e9-8b3b-70a40b9c1aa8.jpg)

## Why
I wanna keep it simple when developing Wechat Mini app. No need to import another framework(React, Vue) or bundler(Webpack, Gulp), the only thing I need is a state management.

我希望只依照小程序的文档，用小程序原生框架进行开发而不用去引入其它前端框架从而增加复杂度。而在用原生框架时，唯一缺失的就是一个类似Redux，Mobx这样的状态管理工具

* `Tiny`: < 1KB 在导入小程序后小于1KB
* `Simple`: 2 API 两个简单的API就可以完成状态管理

## Installation 安装
The base library should greater than 2.2.1 (小程序基础库版本 2.2.1 或以上)

1. `$ npm install minii --production`

2. In WeChat Developer Tool, Tools -> build npm (在开发者工具里面依次点击 工具 -> 构建 npm)

3. In WeChat Developer Tool, Details -> check `Use NPM module` (在开发者工具的详情里面勾选 `使用 npm 模块`)

Official doc: [how to use npm in wechat](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?t=18082018)

## How to use 如何使用
#### 1. create store for the state 创建store(model)来保存对应的state
```JS
// stores/user.js

import { observe } from 'minii'

class UserStore {
  constructor () {
    this.name = 'A'
  }

  changeName (name) {
    this.name = name
  }
}

export default observe(new UserSore(), 'user')
```

#### 2. subscribe state 通过在app.js里面require创建的store来完成对于state的订阅
```JS
// stores/index.js
export userStore from './user'

// app.js
require('./stores/index')
```

#### 3. connect the state to the page 将状态和页面联系起来
```JS
import { mapToData } from 'minii'
import userStore from '../../stores/user'

const connect = mapToData((state) => {
  return {
    myName: state.user.name
  }
})

Page(connect({
 onChangeName () {
   userStore.chnageName('B')
 }
}))
```

#### 4. That'it, the state has bind to Page's data 完成了，页面中的data和状态就这样被绑定在了一起
```html
<view>
  <text>My name</text>
  <text>{{ myName }}</text>
  <button bindtap="onChangeName">Change Name</button>
</view>
```

## API
#### mapToData
* Accept: (Function) | (state) => {}
* Return: Object

mapToData会将状态映射到你当前页面的data上，和react-redux中的connect是类似的概念，这里的state是全局的状态，比如你之前用observe订阅了一个store `observer(instance, 'user')`，这个store里的状态就会在`state.user`上

#### observe
* Accept: (Object, String) | Object 是一个store的实例，String是它在全局state上的变量名，如果没有则会用`storeIntance.constructor.name.toLowerCase()`

observe会将一个store里面的变量都订阅在全局状态下，并通过mapToData让一个页面订阅这些变量，当在任何地方改变store里面的变量，变量的更新都会推送到订阅这些变量的页面中从而更新界面。

推荐所有改变变量的方法都作为instance method写在store里面，而不是在其它任意的地方随意的改变一个store的变量


## Deployment
1. `$ npm run build`
2. `$ npm publish`

## License

MIT


