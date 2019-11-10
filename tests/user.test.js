const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: "Devesh",
    email: "devesh@example.com",
    password: "devesh@123",
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

// check creation of user
test('Signup new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Devesh',
        email: 'deveshnew@example.com',
        password: 'devesh@123'
    }).expect(201)

    // Assert that db was changed
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about the response
    // expect(response.body.user.name).toBe('Devesh')
    // OR
    expect(response.body).toMatchObject({
        user: {
            name: 'Devesh',
            email: 'deveshnew@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('devesh@123')
})

// check user login
test('Login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(response.body.token).toBe(user.tokens[1].token)
})

// check for wrong credentials
test('Should not login non-existing user', async () => {
    await request(app).post('/users/login').send({
        email: "random@random.com",
        password: "random@123"
    }).expect(400)
})

// get authenticated user profile
test('Should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

// fail getting unauthenticated user profile
test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

// delete user profile of authenticated user
test('Should delete profile of authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    // Assert that user was deleted
    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

// fail deleting user profile of unauthenticated user
test('Should not delete profile of unauthenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401)
})


afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close()
    done()
})