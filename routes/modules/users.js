// 新增login路由，並最後再總路由裡載出
const express = require('express')
const router = express.Router()
// 引入user model
const User = require('./../../models/user')
// 引用passport套件
const passport = require('passport')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

// 載入登入驗證 ，用 Passport 提供的 authenticate 方法執行認證
router.post('/login', passport.authenticate('local', {
  // 驗證成功，導向主頁
  successRedirect: '/',
  // 驗證失敗，導向登入頁面
  failureRedirect: '/users/login'
}))

// 註冊資料送出
router.post('/register', (req, res) => {
  // 取得輸入資料
  const { name, email, password, confirmPassword } = req.body

  // 註冊資料的錯誤訊息設定。建立error陣列，接住所有錯誤訊息。
  const errors = []
  // 錯誤1:欄位空白
  if (!name || !email || !password || !confirmPassword) {
    // 這裡的message，指views裡的message模板?
    errors.push({ message: '所有欄位都是必填。' })
  }
  // 錯誤2:password兩次輸入不吻合
  if (password !== confirmPassword) {
    errors.push({ message: '密碼與確認密碼不相符！' })
  }
  // 將錯誤的訊息render回頁面，判定error陣列裡是否有東西，有的話則表示有錯誤訊息。
  if (errors.length) {
    // errors 也要丟回去，這樣樣板才能使用。
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  // 使用email搜尋是否註冊過。因為email:email，是一樣的，所以只需要寫email
  User.findOne({ email })
    .then((user) => {
      // 若有找到，則重新輸入資料(回到register)
      if (user) {
        errors.push({ message: '這個 Email 已經註冊過了。' })
        // 重新輸入的資料留存，需要把input的資料，傳到html留著(記得在相關頁面呼叫value='')
        return res.render('register', { errors, name, email, password })
      }
      // 呼叫User物件，直接新增資料
      return User.create({
        name, email, password
      })
        .then(() => res.redirect('/'))
        .catch(err => console.log(err))
      // // 寫法二
      // // 從User產生一個實例，再將實例存進資料庫
      // const newUser = new User({
      //   name, email, password
      // })
      // newUser.save()
      //   .then(() => res.redirect('/'))
      //   .catch(err => console.log(err))

    })
    .catch(err => console.log(err))
})

// 使用者登出
router.get('/logout', (req, res) => {
  // req.logout() 是 Passport.js 提供的函式，會幫你清除 session。
  req.logout()
  // 登出提示
  req.flash('success_msg', '你已經成功登出。')
  // 登出之後，我們就把使用者帶回登入頁面。
  res.redirect('/users/login')
})


module.exports = router
