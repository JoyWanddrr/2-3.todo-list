// 加入所有的todo路由

const express = require('express')
const router = express.Router()
const db = require('../../models')
const Todo = db.Todo

// 路徑重複的todo可以放在外層(index.js)，所以這裡可以拿掉


router.get('/new', (req, res) => {
  return res.render('new')
})

// 新增資料到資料庫
router.post('/', (req, res) => {
  const userId = req.user.id
  const name = req.body.name
  return Todo.create({ name, userId })
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})

// 查看特定一筆資料時，也需要限制只能找到自己的 todo 資料：
router.get('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  // 這裡要改成findOne，才能串接多個條件。id:先找一樣id的todo，userId:確保這筆todo屬於目前的登入者。
  // return Todo.findById(id)
  return Todo.findOne({ where: { id, userId } })
    .then(todo => res.render('detail', { todo: todo.toJSON() }))
    .catch(error => console.log(error))
})

// 編輯
router.get('/:id/edit', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then(todo => res.render('edit', {
      todo: todo.get()
    }))
    .catch(error => console.log(error))
})

// 修改
router.put('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  console.log(req.params.id)
  const { name, isDone } = req.body
  return Todo.findOne({ where: { id, userId } })
    .then(todo => {
      todo.name = name
      todo.isDone = isDone === 'on'
      return todo.save()
    })
    .then(() => res.redirect(`/todos/${id}`))
    .catch(error => console.log(error))
})
// 刪除
router.delete('/:id', (req, res) => {
  const userId = req.user.id
  const id = req.params.id
  return Todo.findOne({ where: { id, userId } })
    .then(todo => todo.destroy())
    .then(() => res.redirect('/'))
    .catch(error => console.log(error))
})
module.exports = router