const express = require('express')
const app = express()
const session = require('express-session')
// 使用MongoDB資料庫，所對應的，所以需要載入 mongoose。將mongoose分開管理。
// const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
// 載入todo，router設定完之後就用不到了
// const Todo = require('./models/todo')
const bodyParser = require('body-parser')
// 設定連線到 mongoDB。mongoose.connect 是 Mongoose 提供的方法，當程式執行到這一行指令時，就會與資料庫連線。在這裡我們需要告知程式要去哪些尋找資料庫，因此需要傳入連線字串。
//process.env，是指 Node.js 環境變數(當我們想要隱藏一些敏感資訊時，我們會藉由設定環境變數的方式，來將指定資訊傳入程式碼)的界面。故這一串程式碼的意思是，使用 mongoose.connect 去連線 process.env 眾多環境變數之中的 MONGODB_URI 這項環境變數的資訊。
// 處理 DeprecationWarning 警告連線 MongoDB 時傳入 { useNewUrlParser: true } 、{ useUnifiedTopology: true } 的設定
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// 環境變數的設定
// 請你打開終端機，使用以下指令來新增 mongoose.connect 中，要連線的 MONGO_URI 這項環境變數，讓伺服器知道要連線字串，好連線至指定的資料庫。
// export MONGODB_URI = "你的連接字串" //新增環境變數 MONGODB_URI
// 請將「你的連線字串」以我們在「安裝 MongoDB Atlas」 單元中獲得的資料庫連線字串貼上，例如：
// export MONGODB_URI = "mongodb+srv://alpha:camp@cluster0.fovij.mongodb.net/todo-list?retryWrites=true&w=majority"
// 一個 MongoDB 之下可以建立多個資料庫，每個資料庫可以有多位使用者。為了要讓伺服器知道到底是「哪位使用者」要「連線哪個資料庫」，所以在這個步驟中，連線字串需要手動修改的部分包含使用者名稱(alpha)、使用者密碼(camp)、資料庫名稱(todo - list)。
// 然而，這樣設定只是暫時的，只能改變這個終端機當下的環境變數，關掉終端機視窗的話，本次的環境變數設定就會不見。 如果想要永久設定環境變數，請在終端機輸入以下指令，此指令會在 重新開機之後生效：
// echo "export MONGODB_URI=你的連接字串" >> ~/.bash_profile
// 例如：
// echo "export MONGODB_URI=mongodb+srv://alpha:camp@cluster0.fovij.mongodb.net/todo-list?retryWrites=true&w=majority" >> ~/.bash_profile
// 同樣的概念，如果未來你要暫時性，或是永久性的新增、改變某些環境變數的資料，可以使用本單元教的方法來做設定。

// // 取得資料庫連線狀態，放入mogoose.js
// const db = mongoose.connection
// // 連線異常。在這裡用 on 註冊error 監聽事件有沒有發生，語法的意思是「只要有觸發 error 就印出 error 訊息」。
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// // 連線成功。註冊open事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以使用 once(監聽器是一次性的)一旦連線成功，在執行 callback 以後就會解除監聽器。
// db.once('open', () => {
//   console.log('mongodb connected!')
// })

// // 加入這段 code, 僅在非正式環境時, 使用 dotenv
// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }

// 載入passport設定檔，要寫在 express-session 以後
const usePassport = require('./config/passport')

// 引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')
// 將 request 導入路由器
// 載入mongoose.js，不需要設定對象接住。在這裡載入，app.js執行時會一起跑。
require('./config/mongoose')

// 載入method-override，以覆寫http的method
// 注意:確定相對位置，引用的套件清單習慣放在文件最上方，而用 app.use 設定的工具要放在最靠近路由清單的上方，因為有用到 app 變數，所以當然一定要放在 const app = express() 之後：
const methodOverride = require('method-override')


app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

// 設定每一筆請求都會透過 methodOverride 進行前置處理。其中的參數_method，是method-override 幫我們設計的路由覆蓋機制，只要我們在網址上使用 query string (也就是 ?) 帶入這組指定字串，就可以把路由覆蓋掉。
app.use(methodOverride('_method'))

// 設定載入的engine
//建立一個名叫hbs的樣板引擎，並傳入exphbs與相關參數(extname: '.hbs'，是指定副檔名為.hbs預設的長檔名改寫成短檔名)。
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 啟動樣板引擎hbs
app.set('view engine', 'hbs')

// use:每筆request，通過body parser解析
// urlencoded:使用bodyParser解析url
app.use(bodyParser.urlencoded({ extended: true }))
// 使用總路由匯出。定義到home之下，再到index彙整，再回到app.js使用。

// 呼叫 Passport 函式並傳入 app，這條要寫在路由之前
usePassport(app)

// 加入一組middleware，放入本地變數(res.locals)。res.locals裡的資料，所有view都可以存取。
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated
  res.locals.user = req.user
  next()
})

app.use(routes)
// app.get('/', (req, res) => {
//   // 使用find，在未寫入條件之下，會取出全部的資料
//   Todo.find()
//     // 把mongoose的model轉成JS
//     .lean()
//     // 將資料排序，前面指定用甚麼排列，後面放排列的方式。asc:正敘，desc倒敘。此排列會再db裡執行。
//     .sort({ _id: 'asc' })
//     // find取出的物件為todos。{todos}則為{todos:todos}的縮寫
//     .then(todos => res.render('index', { todos }))
//     // 抓取錯誤資訊
//     .catch(error => console.error(error))
// })

// // 使用者可以新增資料路由
// app.get('/todos/new', (req, res) => {
//   return res.render('new')
// })

// // 寫法一
// // new.hbs執行method(POST)的路由
// app.post('/todos', (req, res) => {
//   // 將使用者傳送的東西擷取下來
//   const name = req.body.name
//   // 建立新todo實例，僅存在於伺服器端
//   const todo = new Todo({ name })
//   // todo實例存進資料庫
//   return todo.save()
//     // then傳給前端樣板，並導回首頁
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

// 寫法二，設定新的路由來接住表單資料。
// app.post('/todos', (req, res) => {
//   // 不要忘記載入body Parser
//   const name = req.body.name
//   // 使用create:直接命令mongoose建立(直接建立存進資料庫)
//   return Todo.create({ name })
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))
// })

// // detail路由。:id，其id為字定義參數
// app.get('/todos/:id', (req, res) => {
//   // id為動態參數，使用params取得
//   const id = req.params.id
//   return Todo.findById(id)
//     // 撇除Mongoose的處理，才能render
//     .lean()
//     // 將拿到的資料放入detail.hbs渲染
//     .then(todo => res.render('detail', { todo }))
//     .catch(error => console.log(error))
// })

// // 設定edit路由。會與detail很像，都是取出單筆資料
// app.get('/todos/:id/edit', (req, res) => {
//   const id = req.params.id
//   return Todo.findById(id)
//     .lean()
//     .then(todo => res.render('edit', { todo }))
//     .catch(error => console.log(error))
// })

// // 設定edit的post路由。更改成為PUT(method)，所以路由就不需要edit了。
// app.put('/todos/:id', (req, res) => {
//   const id = req.params.id
//   // 使用解構賦值 --->使用者修改的name，const name = req.body.name。新增checked，const isDone = req.body.isDone。
//   const { name, isDone } = req.body

//   // 1.查詢資料
//   return Todo.findById(id)
//     // 2.如果查詢成功，修改後重新儲存資料
//     // 這裡需要Mongoose的function，所以不用Lean()移除格式
//     .then(todo => {
//       // 修改資料
//       todo.name = name
//       // // 判定isDone的狀態，可縮寫成下面那句
//       // if (isDone === 'on') {
//       //   todo.isDone = true
//       // } else (
//       //   todo.isDone = false
//       // )
//       todo.isDone = isDone === 'on'
//       // save 為Mongoose的function，上傳資料庫
//       // 非同步事件均用return回傳
//       return todo.save()
//     })
//     // 3.如果儲存成功，導向其他頁面
//     .then(() => res.redirect(`/todos/${id}`))
//     .catch(error => console.log(error))
// })

// // delete的POST。更改method為delete，一樣路由後面就不需要delete了
// app.delete('/todos/:id', (req, res) => {
//   const id = req.params.id
//   // 為什麼要先findById，確保此id在資料庫裡是存在的
//   return Todo.findById(id)
//     // 找到的話就then()，在資料庫裡刪除
//     .then(todo => todo.remove())
//     // 刪除之後，把使用者丟回根目錄
//     .then(() => res.redirect('/'))
//     .catch(error => console.log(error))

// })

app.listen(3000, () => {
  console.log('now is running port 3000!')
})