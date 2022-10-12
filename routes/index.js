// 重構路由，此為總路由器

// 總路由器：routes / index.js
// home 路由模組： routes / modules / home.js
// todos 路由模組： routes / modules / todos.js


// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
// 引入 todos 模組程式碼
const todos = require('./modules/todos')

// 引入home模組程式碼
const home = require('./modules/home')
// 將網址結構符合 / 字串的 request 導向 home 模組(如果request路徑是'/',就執行home的程式碼) 。此為首頁路由。最後再放入app.js使用。
router.use('/', home)
// 將todos路由彙整，再由總路由匯出
router.use('/todos', todos)






// 匯出路由器，這裡的router是const router嗎
module.exports = router