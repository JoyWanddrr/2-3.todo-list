// // 建立種子資料

// // 一樣使用到mongoDB，且因為會上傳到資料庫，所以還需資料庫連線
// const mongoose = require('mongoose')
// // 種子資料與Todo model(todo.js)有關，需載入使用
// const Todo = require('../todo')

// // 設定mongoDB連線
// mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

// // 儲存mongoose.connect設定
// const db = mongoose.connection
// // 檢測是否有連接上資料庫
// db.on('error', () => {
//   console.log('mongodb error!')
// })
// db.once('open', () => {
//   console.log('mongodb connected!')
//   // "新增資料"腳本，會在成功連線資料庫後才執行的動作，所以寫在db.once()的callback函式裡
//   // 使用迴圈一次新增10筆資料。Todo.create() 是 Mongoose 提供的資料操作方法，之前我們建立了一個叫 Todo 的 model 物件，而每一個 model 物件都具有一系列的資料操作方法。
//   for (let i = 0; i < 10; i++) {
//     // 只需新增需要修改的資料部分。
//     Todo.create({ name: `name=${i}` })
//   }
//   console.log('done')
// })

// 重構mongoose

// const Todo = require('../todo')
// const db = require('../../config/mongoose')
// db.once('open', () => {
//   for (let i = 0; i < 10; i++) {
//     Todo.create({ name: 'name-' + i })
//   }
//   console.log('done')
// })

// 重構種子資料，建立範例使用者

// 載入密碼
const bcrypt = require('bcryptjs')

// 需要載入dotenv，因為所有變數已經使用.env取代
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
// 載入todo，user的schema用以新增資料進入資料庫
const Todo = require('../todo')
const User = require('../user')

const db = require('../../config/mongoose')

// 建立範例使用者資訊
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

// 當資料庫開啟時
db.once('open', () => {
  // 將密碼改成暗碼
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    // 創建範例todo list，掛載在範例使用者名下
    // create會回傳user，所以可以抓取user的資訊(包括session ID)
    .then(user => {
      const userId = user._id
      // 注意，使用for 迴圈會使資料尚未跑完就跳到下一個，所以改用promise
      return Promise.all(Array.from({ length: 10 }, (_, i) =>
        Todo.create({ name: `name-${i}`, userId })))
    })
    .then(() => {
      console.log('done')
      process.exit()
    })
})

