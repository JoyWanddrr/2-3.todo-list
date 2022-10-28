// 新增login路由，並最後再總路由裡載出
const express = require('express')
const router = express.Router()
// 引入user model
const User = require('./../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/login', (req, res) => {

})

// 註冊資料送出
router.post('/register', (req, res) => {
  // 取得輸入資料
  const { name, email, password, confirmPassword } = req.body
  // 使用email搜尋是否註冊過。因為email:email，是一樣的，所以只需要寫email
  User.findOne({ email })
    .then((user) => {
      // 若有找到，則重新輸入資料(回到register)
      if (user) {
        console.log('This email has been used.')
        // 重新輸入的資料留存，需要把input的資料，傳到html留著(記得在相關頁面呼叫value='')
        res.render('register', { name, email, password })
      } else {
        // 沒有創建資料，有兩種寫法。但不能理解為什麼要return
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
      }

    })
    .catch(err => console.log(err))
})


module.exports = router
