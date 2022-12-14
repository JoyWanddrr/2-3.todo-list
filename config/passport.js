// 設定登入驗證

const db = require('../models')
const User = db.User

// 引入passport，以及local驗證的strategy
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const FacebookStrategy = require('passport-facebook').Strategy

// 直接輸出函式，使用app參數，之後在app.js載入app參數
module.exports = app => {
  // 初始化passport模組
  app.use(passport.initialize())
  // passport.session=express.session
  app.use(passport.session())

  // 設定本地登入策略
  // usernameField:'email'-->更改預設驗證項目為email
  // (email,passport,done)--->驗證email,password。done為控制成功/失敗的流程。
  //  passReqToCallback:The verify callback can be supplied with the request object by setting the passReqToCallback option to true, and changing callback arguments accordingly.
  // callback中，放入req==>(req,email,password,done)
  passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, (req, email, password, done) => {
    // 需引用user才能比對email
    User.findOne({ where: { email } })
      .then(user => {
        // 比對user如果不同
        if (!user) {
          // 登入失敗，回傳訊息
          // 使用app.js裡已設定好的warning_msg
          return done(null, false, req.flash('warning_msg', 'That email is not registered!'))
          //  { message: 'That email is not registered!' })
        }
        // 因為密碼使用bcrypt，所以這裡需要用bcrypt做解析比較。前面的password是輸入的password，後面的是find出來的password。
        // 注意，在密碼加密完之後，之前所創建的帳號密碼(明碼)，就無法使用了。
        return bcrypt.compare(password, user.password)
          // isMatch是bcrypt回傳的結果
          .then(isMatch => {
            // 因為下面是false，表示上面也是false，所以要非true
            if (!isMatch) {
              return done(null, false, req.flash('warning_msg', 'Email or Passport is incorrect.'))
            }
            // 登入成功，回傳user
            return done(null, user)
          })
      })
      //抓取錯誤
      .catch(err => done(err, false))
  }))

  // 第三方登入策略(FB)
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName'],
  }, (accessToken, refreshToken, profile, cb) => {
    // 使用profile(FB)裡的json物件(顯示登入者的基本資訊)，完成登入驗證
    const { name, email } = profile._json
    User.findOne({ where: { email } })
      .then(user => {
        // 如果在資料庫裡有找到user，則回傳user資訊
        if (user) return done(null, user)
        // 為新建的user製造隨機密碼
        const randomPassword = Math.random.toString(36).slice(-8)
        // 反之，則新建資料，使用bcrypt加密
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          // hash為加密過的密碼
          .then(hash => User.create({
            name, email, password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(null, false))
      })
  }
  ))



  // 設定serialize/deserialize
  passport.serializeUser((user, done) => {
    // user--->session id
    done(null, user.id)
  })
  // 由於有資料庫操作，依照 Promise 風格用 .then().catch() 來控制流程
  passport.deserializeUser((id, done) => {
    User.findByPk(id)
      // 從資料庫拿出來的物件，很可能會傳進前端樣板，因此遵從 Handlebars 的規格，先用 .lean() 把資料庫物件轉換成 JavaScript 原生物件。
      .then(user => {
        user = user.toJSON()
        done(null, user)
      })
      // 錯誤處理的地方，其實 Passport 看到第一個參數有 err 就不會處理後面的參數了，但我們放一個 null 在語義上明確表達 user 是空的
      .catch(err => done(err, null))
  })
}