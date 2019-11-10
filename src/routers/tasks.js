const express = require('express')
const Task = require('../models/task')
const router = new express.Router()
const auth = require('../middleware/auth')

// TASK
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        await req.user.populate('tasks').execPopulate()
        res.status(200).send(req.user.tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOne({
            _id: _id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send({ error: 'Document not found' })
        } else {
            res.send(task)
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    if (!isValidOperation) {
        return res.status(400).send({ error: 'invalid updates' })
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id
        })

        if (!task) {
            return res.status(404).send({ error: 'NOT FOUND' })
        } else {
            updates.forEach((update) => {
                task[update] = req.body[update]
            })
            await task.save()
            res.send(task)
        }
    } catch (error) {
        res.status(400).send()
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        })
        // const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            res.status(404).send({ error: 'document not found' })
        } else {
            res.send({ success: 'deletion successful', deletedTask: task })
        }
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router