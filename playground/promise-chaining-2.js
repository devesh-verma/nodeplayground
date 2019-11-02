require('../src/db/mongoose')
const Task = require('../src/models/task')

// Task.findByIdAndDelete('5dbbffe1fae4fd50b1440918').then((task) => {
//     console.log('done')
//     console.log(task)
// }).catch((e) => {
//     console.log('klu')
//     console.log(e)
// })

// Task.findByIdAndDelete('ç').then((task) => {
//     console.log(task)
//     return Task.countDocuments({ completed: false })
// }).then((count) => {
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

deleteTaskAndCount('5dbc0012fae4fd50b1440919').then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})