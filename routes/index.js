// 重構路由，此為總路由器

// 總路由器：routes / index.js
// home 路由模組： routes / modules / home.js
// todos 路由模組： routes / modules / todos.js


// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引入 todos 模組程式碼
const todos = require('./modules/todos')
const users = require('./modules/users')
// 引入home模組程式碼
const home = require('./modules/home')
// 將網址結構符合 / 字串的 request 導向 home 模組(如果request路徑是'/',就執行home的程式碼) 。此為首頁路由。最後再放入app.js使用。

// 引入FB路由
const auth = require('./modules/auth')

// 掛載 middleware
const { authenticator } = require('../middleware/auth')



// 加入驗證程序
router.use('/todos', authenticator, todos)
router.use('/users', users)
// 掛載模組，注意載入順序。
router.use('/auth', auth)
// 加入驗證程序，因為這兩樣需要登入才能使用。注意router順序，'/'在前會造成無限循環，通常會把條件較為寬鬆的往下排，或者路由較短的。
router.use('/', authenticator, home)





// 匯出路由器，這裡的router是const router嗎
module.exports = router