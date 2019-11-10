const mongoose = require('mongoose');

// console.log(process.env.DB_HOST)

mongoose.connect(process.env.DB_HOST, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})