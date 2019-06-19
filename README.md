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

简体中文 | [English](./README-EN.md)

## 特点
* `体积小`: 在导入小程序后小于1KB
* `易使用`: 通过两个API就可以完成状态管理

## 安装
*小程序基础库版本 2.2.1 或以上*

1. `$ npm install minii --production`

2. 在开发者工具里面依次点击 工具 -> 构建 npm

3. 在开发者工具的详情里面勾选 `使用 npm 模块`

## 如何使用
#### 1. 创建store(model)来保存对应的state
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

// 第二个参数'user'会将当前store的所有内部变量绑定在全局变量的user属性上
// 如果第二个参数没有写，会默认使用该class名字的全小写
export default observe(new UserStore(), 'user')
```

#### 2. 将状态和页面联系起来
```JS
import { mapToData } from 'minii'
import userStore from '../../stores/user'

const connect = mapToData((state) => ({
  myName: state.user.name
}))

Page(connect({
  onChangeName () {
    userStore.changeName('B')
  }
}))
```

#### 3. 在页面中使用绑定的data
```html
<view>
  <text>My name</text>
  <text>{{ myName }}</text>
  <button bindtap="onChangeName">Change Name</button>
</view>
```

#### 4. 需要在小程序启动时引用创建的store(此举是为了调用observe)
推荐在项目中创建一个文件统一引用所有的store，比如项目结构如下：

```js
/stores
  user.js
  shop.js
  index.js
app.js
```

然后在stores/index.js中引入所有store

```js
export userStore from './user'
export shopStore from './shop
```

最后在小程序的app.js中引用这个统一的文件

```js
require('./stores/index')
```

## API
#### mapToData

mapToData会将需要的数据映射到你当前页面的data上，和react-redux中的connect是类似的概念，这里的state是全局的状态，比如你之前用observe订阅了一个store `observer(instance, 'user')`，这个store里的局部变量就可以通过`state.user`得到

#### observe

observe会将一个store里面的变量都订阅在全局状态下，并通过mapToData让一个页面订阅这些变量，当在任何地方改变store里面的变量，变量的更新都会推送到订阅这些变量的页面中从而更新界面。

推荐所有改变变量的方法都作为内部方法写在store里面，而不是在其它任意的地方随意的改变一个store的变量


## Deployment
1. `$ npm run build`
2. `$ npm publish`

## License

MIT


