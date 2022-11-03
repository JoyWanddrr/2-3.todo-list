// 驗證登入的router

const express = require('express')
const router = express.Router()
// 載入passport用以抓取驗證
const passport = require('passport')

// 使用者用按鈕點選FB登入(路由導向FB)使用passport的FB驗證，scope:請求email跟public_profile。
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email', 'public_profile']
}))

// 請求FB之後，FB資訊回傳的路由。
router.get('/facebook/callback', passport.authenticate('facebook', {
  // 請求成功
  successRedirect: '/',
  // 請求失敗
  failureRedirect: '/users/login'
}))


module.exports = router

