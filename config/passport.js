// 設定登入驗證


// 引入passport，以及local驗證的strategy
const passport = require('passport')
const user = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const User = require('./../models/user')

// 直接輸出函式，使用app參數，之後在app.js載入app參數
module.exports = app => {
  // 初始化passport模組
  app.use(passport.initialize())
  // passport.session=express.session
  app.use(passport.session())

  // 設定本地登入策略
  // usernameField:'email'-->更改預設驗證項目為email
  // (email,passport,done)--->驗證email,password。done為控制成功/失敗的流程。
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    // 需引用user才能比對email
    User.findOne({ email })
      .then(user => {
        // 比對user如果不同
        if (!user) {
          // 登入失敗，回傳訊息
          return done(null, false, { message: 'That email is not registered!' })
        }
        if (user.password !== password) {
          return done(null, false, { message: 'Email or Passport is not correct.' })
        }
        // 登入成功，回傳user
        return done(null, user)
      })
      //抓取錯誤
      .catch(err => done(err, false))
  }))


  // 設定serialize/deserialize
  passport.serializeUser((user, done) => {
    // user--->session id
    done(null, user.id)
  })
  // 由於有資料庫操作，依照 Promise 風格用 .then().catch() 來控制流程
  passport.deserializeUser((id, done) => {
    User.findById(id)
      // 從資料庫拿出來的物件，很可能會傳進前端樣板，因此遵從 Handlebars 的規格，先用 .lean() 把資料庫物件轉換成 JavaScript 原生物件。
      .lean()
      .then(user => done(null, user))
      // 錯誤處理的地方，其實 Passport 看到第一個參數有 err 就不會處理後面的參數了，但我們放一個 null 在語義上明確表達 user 是空的
      .catch(err => done(err, null))
  })
}