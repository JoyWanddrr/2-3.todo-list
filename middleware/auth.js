// 驗證登入狀態

// 匯出一個物件，物件裡是一個叫做 authenticator 的函式。
module.exports = {
  authenticator: (req, res, next) => {
    // req.isAuthenticated() 是 Passport.js 提供的函式，會根據 request 的登入狀態回傳 true 或 false。如果req驗證為ture，則執行下一個 middleware(next())
    if (req.isAuthenticated()) {
      return next()
    }
    // 反之，導回登入頁面
    res.redirect('/users/login')
  }
}