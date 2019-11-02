const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(email) {
            if (!validator.isEmail(email)) {
                throw new Error('Invalid emailid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        lowercase: true,
        validate(password) {
            if (password.toLowerCase().includes('password')) {
                throw new Error('Password cannot be password')
            }
        }
    },
    age: {
        type: Number,
        default: 0
    }
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email
    })

    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(passowrd, user.password)
    console.log(isMatch)
    if (!isMatch) {
        console.log('failure')
        throw new Error('Unable to login')
    }
    console.log('success')
    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User