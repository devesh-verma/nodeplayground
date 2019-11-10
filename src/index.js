const app = require('./app')
const port = process.env.PORT

app.listen(port, () => {
    console.log("process is up: ", port)
})

process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Process terminated')
    })
})
