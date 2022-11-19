const express = require('express')
const app = express()
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
// 載入passport設定檔(使用者認證套件)，要寫在 express-session 以後
const usePassport = require('./config/passport')
// 載入connect-flash，用以顯示訊息提示
const flash = require('connect-flash')

// 使用dotenv套件加載環境變數，要記得安裝dotenv。
//NODE_ENV為node.js通用的值，會讀取.env。在production mode中，NODE_ENV會轉成production，就不會讀取.env。 
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 注意順序，要在process.env載入之後
const PORT = process.env.PORT
// 引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')
// 將 request 導入路由器

const methodOverride = require('method-override')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// 設定每一筆請求都會透過 methodOverride 進行前置處理。其中的參數_method，是method-override 幫我們設計的路由覆蓋機制，只要我們在網址上使用 query string (也就是 ?) 帶入這組指定字串，就可以把路由覆蓋掉。
app.use(methodOverride('_method'))
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 啟動樣板引擎hbs
app.set('view engine', 'hbs')
app.use(bodyParser.urlencoded({ extended: true }))
// 使用總路由匯出。定義到home之下，再到index彙整，再回到app.js使用。

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

app.use(flash())// 掛載套件
// 加入一組middleware，放入本地變數(res.locals)。res.locals裡的資料，所有view都可以存取。
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  // 新增要傳入locals儲存的錯誤訊息提示
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  next()
})

app.use(routes)

app.listen(PORT, () => {
  console.log(`now is running port ${PORT}!`)
})