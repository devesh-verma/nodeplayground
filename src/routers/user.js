const express = require('express')
const User = require('../models/user')
const router = new express.Router()

// USER
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = user.generateAuthToken()
        res.status(201).status(201).send({ user: user, token: token })
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user: user, token: token })
    } catch (error) {
        console.log('error:', error)
        res.status(400).send({ error: error })
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send()
    }
})

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user) {
            console.log("no such user")
            res.status(404).send()
        } else {
            res.send(user)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/users/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid update' })
    }

    try {
        // this way cannot bypass mongoose middleware
        const user = await User.findById(_id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        await user.save()

        // The below bypasses mongoose middleware
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/users/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            res.status(404).send('No such user')
        } else {
            res.send({ success: 'user deletetion successful', user: user })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router