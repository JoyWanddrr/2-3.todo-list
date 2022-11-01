// 定義一筆資料的資料結構
// todo.js 檔案，代表 Todo model，以後每一種資料都會有一個獨立文件來管理

// MongoDB的todo，所以require mongoose
const mongoose = require('mongoose')

// Schema是mongoose提供的定義資料結構的方式
const Schema = mongoose.Schema

// new + Schema()建構子函式
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // required的值為true，表示必填欄位
  },
  // 新增是否完成的數值
  isDone: {
    type: Boolean,
    // 預設完成狀態為 false
    default: false,
  },
  // 建立與User Collection的關聯。在輸入每一筆todo時，夾帶userId，已辨別User使用者。再去修改相關router。
  userId: {
    type: Schema.Types.ObjectId,
    //表示與User model關聯
    ref: 'User',
    index: true,
    require: true
  }
})

// 然後透過 module.exports 輸出。mongoose.model 會複製我們定義的 Schema 並編譯成一個可供操作的 model 物件，匯出的時候我們把這份 model 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了！
module.exports = mongoose.model('Todo', todoSchema)