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

const Todo = require('../todo')
const db = require('../../config/mongoose')
db.once('open', () => {
  for (let i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i })
  }
  console.log('done')
})