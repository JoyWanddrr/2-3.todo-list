// 將mongoose的設定全部放入，以供app.js以及toSeeder.js使用

const mongoose = require('mongoose')
// mongoose.connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
mongoose.connect("mongodb+srv://Alpha:camp@cluster0.j297u5e.mongodb.net/todo-list?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection
// 連線異常。在這裡用 on 註冊error 監聽事件有沒有發生，語法的意思是「只要有觸發 error 就印出 error 訊息」。
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功。註冊open事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以使用 once(監聽器是一次性的)一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})

// 因為在todoSeeder，會更改db.once('open')的設定，所以把db export
module.exports = db
