const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.PORT || 3000

// parses incoming json to object
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log("process is up: ", port)
})

const Task = require('./models/task')
const User = require('./models/user')

const main = async () => {
    // const task = await Task.findById('5dbef4dca9e5d4157094aa5d')
    // await task.populate('owner').execPopulate()
    // console.log('OWNER: ', task.owner)

    // 5dbef4148525d5102d44f73a
    const user = await User.findById('5dbef4148525d5102d44f73a')
    await user.populate('tasks').execPopulate()
    console.log(user.tasks)
}

main()