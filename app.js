const express = require('express')
const app = express()
// 使用MongoDB資料庫，所對應的，所以需要載入 mongoose。
const mongoose = require('mongoose')

// 設定連線到 mongoDB。mongoose.connect 是 Mongoose 提供的方法，當程式執行到這一行指令時，就會與資料庫連線。在這裡我們需要告知程式要去哪些尋找資料庫，因此需要傳入連線字串。
//process.env，是指 Node.js 環境變數(當我們想要隱藏一些敏感資訊時，我們會藉由設定環境變數的方式，來將指定資訊傳入程式碼)的界面。故這一串程式碼的意思是，使用 mongoose.connect 去連線 process.env 眾多環境變數之中的 MONGODB_URI 這項環境變數的資訊。
// 處理 DeprecationWarning 警告連線 MongoDB 時傳入 { useNewUrlParser: true } 、{ useUnifiedTopology: true } 的設定
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

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

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常。在這裡用 on 註冊error 監聽事件有沒有發生，語法的意思是「只要有觸發 error 就印出 error 訊息」。
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功。註冊open事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以使用 once(監聽器是一次性的)一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected!')
})




app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(3000, () => {
  console.log('now is running port 3000!')
})