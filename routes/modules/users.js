// 新增login路由，並最後再總路由裡載出
const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login')
})

module.exports = router
