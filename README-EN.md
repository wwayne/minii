# Minii

[![Version](http://img.shields.io/npm/v/minii.svg)](https://www.npmjs.org/package/minii)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)
[![npm download][download-image]][download-url]
[![Build Status](https://travis-ci.org/wwayne/minii.svg?branch=master)](https://travis-ci.org/wwayne/minii)

[download-image]: https://img.shields.io/npm/dm/minii.svg?style=flat-square
[download-url]: https://npmjs.org/package/minii

## Who's using
![gh_a1cda2fbab45_258](https://user-images.githubusercontent.com/5305874/53417621-e9541400-3a10-11e9-9dd7-86ab851ddab5.jpg)
![gh_f977d523b1b8_258](https://user-images.githubusercontent.com/5305874/56073712-19961d00-5ddb-11e9-8b3b-70a40b9c1aa8.jpg)

[简体中文](./README.md) | English

## Why

* `Tiny Size`: after importing into the app, the package's size is smaller than 1kb
* `Simple Usage`: only 2 API for state management binding

## Installation
The base library should greater than 2.2.1

1. `$ npm install minii --production`

2. In WeChat Developer Tool, Tools -> build npm

3. In WeChat Developer Tool, Details -> check `Use NPM module`

Official doc: [how to use npm in wechat](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html?t=18082018)

## How to use
#### 1. Create store for observing data
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

// the second params 'user' gonna bind this store's attributes into globalState.user
// if the second params is empty, the lowercase of the class name will be used
export default observe(new UserSore(), 'user')
```

#### 2. Bind state into page
```JS
import { mapToData } from 'minii'
import userStore from '../../stores/user'

const connect = mapToData((state) => ({
	myName: state.user.name
}))

Page(connect({
 onChangeName () {
   userStore.chnageName('B')
 }
}))
```

#### 3. Use the bound state in the page
```html
<view>
  <text>My name</text>
  <text>{{ myName }}</text>
  <button bindtap="onChangeName">Change Name</button>
</view>
```

#### 4. We need require store when launching the app (this is only for `observe`)
Creating a file to import all stores is recommended, e.g.：

```js
/stores
  user.js
  shop.js
  index.js
app.js
```

import all stores in stores/index.js

```js
export userStore from './user'
export shopStore from './shop
```

require this file in mini-app's app.js

```js
require('./stores/index')
```

## API
#### mapToData

`mapToDate` is for connecting state into page's data, you can think about it like `connect` in react-redux. After observing a store `observer(instance, 'user')`, we can get the store's state by `state.user`

#### observe

`observe` is for binding the store's attribute into the global state and observe the changes. While changing the store's observed attributes will lead pages' update.

Only changing store's attribute through store's instance methods is recommened


## Deployment
1. `$ npm run build`
2. `$ npm publish`

## License

MIT


