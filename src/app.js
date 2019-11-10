const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()

// parses incoming json to object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

module.exports = app