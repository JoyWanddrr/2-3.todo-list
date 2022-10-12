// 預計放與首頁相關的路由

const express = require('express')
const router = express.Router()
const Todo = require('../../models/todo')

router.get('/', (req, res) => {
  Todo.find()
    .lean()
    .sort({ _id: 'asc' })
    .then(todos => res.render('index', { todos }))
    .catch(error => console.error(error))
})


// 匯出路由器，這裡的router是const router嗎。這裡的router會先進入home，再由home彙整出去。
module.exports = router