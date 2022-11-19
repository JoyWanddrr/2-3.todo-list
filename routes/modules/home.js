// 預計放與首頁相關的路由

const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo
const User = db.User

// 這種寫法，在sequelize裡不會顯示真正的資料
// router.get('/', (req, res) => {
//   // 確認使用者「只會看到自己的 todo 資料」
//   const userId = req.user.id
//   Todo.findOne({ where: { userId } })//查詢「屬於登入使用者的 todo」
//     .then(todos => res.render('index', { todos }))
//     .catch(error => console.error(error))
// })
router.get('/', (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error('user not found')

      return Todo.findAll({
        raw: true,
        nest: true,
        where: { UserId: req.user.id }
      })
    })
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})

// 匯出路由器，這裡的router是const router嗎。這裡的router會先進入home，再由home彙整出去。
module.exports = router